const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { query, masterQuery, getCurrentTenantDbName } = require('../config/database');
const { error: errorResponse } = require('../utils/responseHelper');
const { canAccessStudent } = require('../utils/accessControl');
const { getSchoolProfile } = require('../services/schoolProfileService');

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB');
}

function parseRole(req) {
  const roleName = (req.user?.role_name || '').toString().trim().toLowerCase();
  const roleId = Number(req.user?.role_id || 0);
  return { roleName, roleId };
}

function isAllowedBonafideRole(req) {
  const { roleName, roleId } = parseRole(req);
  if (roleName === 'admin' || roleId === 1) return true;
  if (roleName === 'student' || roleId === 2) return true;
  if (roleName === 'parent' || roleId === 4) return true;
  if (roleName === 'guardian' || roleId === 5) return true;
  return false;
}

function resolveLogoPathOrUrl(logoUrl) {
  const value = String(logoUrl || '').trim();
  if (!value) return null;
  if (value.startsWith('/api/school/profile/logo/')) {
    const parts = value.split('/').filter(Boolean);
    const tenant = (parts[4] || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const file = (parts[5] || '').replace(/[^a-zA-Z0-9._-]/g, '');
    if (!tenant || !file) return null;
    return path.join(__dirname, '../../uploads/school-logos', tenant, file);
  }
  if (value.startsWith('/uploads/school-logos/')) {
    return path.join(__dirname, '../../', value.replace(/^\/+/, ''));
  }
  return null;
}

async function getLogoBuffer(logoUrl) {
  const source = resolveLogoPathOrUrl(logoUrl);
  if (!source) return null;
  if (fs.existsSync(source)) {
    return fs.readFileSync(source);
  }
  return null;
}

function safeText(value, fallback = '-') {
  const v = String(value == null ? '' : value).trim();
  return v || fallback;
}

function drawCertificateLayout(doc, data) {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 50;
  const usableWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  const bgCream = '#f8f5ef';
  const deepBlue = '#29478a';
  const lightGrey = '#e3e6ea';
  const textColor = '#2f3147';
  const lineColor = '#7d8191';
  const rollNumber = safeText(data.rollNumber, data.admissionNumber);

  // Background fill
  doc.save().fillColor(bgCream).rect(0, 0, pageWidth, pageHeight).fill().restore();

  // Top-left and top-right blue diagonal triangles
  doc
    .save()
    .fillColor(deepBlue)
    .polygon([0, 0], [214, 0], [0, 214])
    .fill()
    .restore();
  doc
    .save()
    .fillColor(deepBlue)
    .polygon([pageWidth, 0], [pageWidth - 214, 0], [pageWidth, 214])
    .fill()
    .restore();

  // Bottom-center light grey triangle
  doc
    .save()
    .fillColor(lightGrey)
    .polygon([centerX - 140, pageHeight], [centerX + 140, pageHeight], [centerX, pageHeight - 172])
    .fill()
    .restore();

  // Centered title in serif style with text-width underline
  const title = 'BONAFIDE CERTIFICATE';
  const titleY = margin + 95;
  const titleSize = 25;
  doc.fillColor('#1f2344').font('Times-Bold').fontSize(titleSize);
  const titleWidth = doc.widthOfString(title);
  const titleX = centerX - titleWidth / 2;
  doc.text(title, titleX, titleY, { lineBreak: false });
  const underlineY = titleY + 37;
  doc
    .save()
    .lineWidth(1.4)
    .strokeColor('#2f3f6f')
    .moveTo(titleX, underlineY)
    .lineTo(titleX + titleWidth, underlineY)
    .stroke()
    .restore();

  // Optional school logo near top-center (kept subtle to preserve reference layout)
  if (data.logoBuffer) {
    try {
      const logoSize = 42;
      doc.image(data.logoBuffer, centerX - logoSize / 2, margin + 22, {
        fit: [logoSize, logoSize],
        align: 'center',
        valign: 'center',
      });
    } catch {
      // Continue without logo if image decode fails.
    }
  }

  // Body paragraph as centered readable block with mixed bold emphasis
  const bodyWidth = 402;
  const bodyX = centerX - bodyWidth / 2;
  const bodyY = underlineY + 48;
  // Keep body inside a centered container and bold key dynamic values.
  // Use left alignment within the centered block to avoid overlap with continued fragments.
  const commonTextOptions = { width: bodyWidth, align: 'left', lineGap: 4.2, continued: true };
  doc.fillColor(textColor).font('Helvetica').fontSize(17.5);
  doc.text('This is to certify that ', bodyX, bodyY, commonTextOptions);
  doc.font('Helvetica-Bold').text(`${data.studentName}, `, commonTextOptions);
  doc.font('Helvetica').text('S/O ', commonTextOptions);
  doc.font('Helvetica-Bold').text(`${data.parentName} `, commonTextOptions);
  doc.font('Helvetica').text(`bearing roll number ${rollNumber}, is a student of `, commonTextOptions);
  doc.font('Helvetica-Bold').text(`class ${data.className} `, commonTextOptions);
  doc.font('Helvetica').text('for the academic year ', commonTextOptions);
  doc.font('Helvetica-Bold').text(`${data.academicYear}. `, commonTextOptions);
  doc.font('Helvetica').text('He is a bona fide student of ', commonTextOptions);
  doc
    .font('Helvetica-Bold')
    .text(`${data.schoolName}.`, { width: bodyWidth, align: 'left', lineGap: 4.2, underline: true });

  // Footer group: signature/date on one baseline, then centered seal placeholder.
  const bodyEndY = doc.y;
  const footerLineY = Math.max(bodyEndY + 72, pageHeight - 318);
  const leftLineX = margin + 26;
  const lineWidth = 150;
  const rightLineX = pageWidth - margin - 26 - lineWidth;

  doc
    .save()
    .lineWidth(1.1)
    .strokeColor(lineColor)
    .moveTo(leftLineX, footerLineY)
    .lineTo(leftLineX + lineWidth, footerLineY)
    .moveTo(rightLineX, footerLineY)
    .lineTo(rightLineX + lineWidth, footerLineY)
    .stroke()
    .restore();

  doc.fillColor('#2f3147').font('Helvetica').fontSize(13);
  doc.text('Signature, Principal', leftLineX, footerLineY + 6, { width: lineWidth, align: 'left' });
  doc.text('Date', rightLineX, footerLineY + 6, { width: lineWidth, align: 'left' });

  const sealBoxW = 92;
  const sealBoxH = 92;
  const sealBoxX = centerX - sealBoxW / 2;
  const sealBoxY = footerLineY + 30;
  doc
    .save()
    .lineWidth(0.5)
    .strokeColor('#cfd4dc')
    .rect(sealBoxX, sealBoxY, sealBoxW, sealBoxH)
    .stroke()
    .restore();

  doc.fillColor('#2f3147').font('Helvetica').fontSize(12).text('School Seal', centerX - 42, sealBoxY + sealBoxH + 8, {
    width: 84,
    align: 'center',
  });
}

const downloadBonafide = async (req, res) => {
  try {
    const studentId = Number(req.params.id);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      return errorResponse(res, 400, 'Invalid student ID');
    }

    if (!isAllowedBonafideRole(req)) {
      return errorResponse(res, 403, 'Access denied. Insufficient permissions.');
    }

    const access = await canAccessStudent(req, studentId);
    if (!access.ok) {
      return errorResponse(res, access.status || 403, access.message || 'Access denied');
    }

    const studentRes = await query(
      `SELECT
         s.id,
         s.first_name,
         s.last_name,
         s.admission_number,
         s.date_of_birth,
         c.class_name,
         sec.section_name,
         ay.year_name AS academic_year_name,
         p.father_name,
         p.mother_name,
         g.first_name AS guardian_first_name,
         g.last_name AS guardian_last_name
       FROM students s
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN sections sec ON s.section_id = sec.id
       LEFT JOIN academic_years ay ON s.academic_year_id = ay.id
       LEFT JOIN parents p ON s.parent_id = p.id
       LEFT JOIN guardians g ON s.guardian_id = g.id
       WHERE s.id = $1 AND s.is_active = true
       LIMIT 1`,
      [studentId]
    );

    if (!studentRes.rows || studentRes.rows.length === 0) {
      return errorResponse(res, 404, 'Student not found');
    }

    const student = studentRes.rows[0];
    const studentName = safeText(`${student.first_name || ''} ${student.last_name || ''}`.trim());
    const parentName = safeText(
      student.father_name ||
        student.mother_name ||
        `${student.guardian_first_name || ''} ${student.guardian_last_name || ''}`.trim()
    );

    const profile = await getSchoolProfile(req.user?.school_name || null);
    const tenantDbName = getCurrentTenantDbName();
    let fullSchoolNameFromMaster = null;
    try {
      const masterSchool = await masterQuery(
        `SELECT school_name, type
         FROM schools
         WHERE db_name = $1
         ORDER BY id ASC
         LIMIT 1`,
        [tenantDbName]
      );
      const schoolNamePart = safeText(masterSchool?.rows?.[0]?.school_name, '');
      const schoolTypePart = safeText(masterSchool?.rows?.[0]?.type, '');
      const combined = `${schoolNamePart} ${schoolTypePart}`.trim();
      fullSchoolNameFromMaster = combined || null;
    } catch {
      fullSchoolNameFromMaster = null;
    }
    const schoolName = safeText(fullSchoolNameFromMaster || profile?.school_name, safeText(req.user?.school_name, 'School'));

    let logoBuffer = null;
    try {
      logoBuffer = await getLogoBuffer(profile.logo_url);
    } catch {
      logoBuffer = null;
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('error', (err) => {
      console.error('Bonafide PDF stream error:', err);
    });
    doc.on('end', () => {
      const pdf = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="bonafide_${String(student.admission_number).replace(/[^a-zA-Z0-9_-]/g, '') || student.id}.pdf"`
      );
      return res.status(200).send(pdf);
    });

    drawCertificateLayout(doc, {
      logoBuffer,
      schoolName,
      studentName,
      parentName,
      className: safeText(student.class_name),
      sectionName: safeText(student.section_name),
      academicYear: safeText(student.academic_year_name, 'Current Academic Year'),
      admissionNumber: safeText(student.admission_number),
      dob: formatDate(student.date_of_birth),
      issueDate: formatDate(new Date()),
    });

    doc.end();
  } catch (err) {
    console.error('Bonafide generation error:', err);
    return errorResponse(res, 500, 'Failed to generate bonafide certificate');
  }
};

module.exports = {
  downloadBonafide,
};

