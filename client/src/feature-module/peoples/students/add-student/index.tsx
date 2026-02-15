import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import { feeGroup, feesTypes, paymentType } from '../../../core/common/selectoption/selectoption'
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import {
  AdmissionNo,
  Hostel,
  PickupPoint,
  VehicleNumber,
  allClass,
  gender,
  names,
  rollno,
  route,
  status,
  roomNO,
} from "../../../../core/common/selectoption/selectoption";

import CommonSelect from "../../../../core/common/commonSelect";
import { useLocation } from "react-router-dom";
import TagInput from "../../../../core/common/Taginput";
import { useAcademicYears } from "../../../../core/hooks/useAcademicYears";
import { useClasses } from "../../../../core/hooks/useClasses";
import { useSections } from "../../../../core/hooks/useSections";
import { useBloodGroups } from "../../../../core/hooks/useBloodGroups";
import { useReligions } from "../../../../core/hooks/useReligions";
import { useCasts } from "../../../../core/hooks/useCasts";
import { useMotherTongues } from "../../../../core/hooks/useMotherTongues";
import { useHouses } from "../../../../core/hooks/useHouses";
import { apiService } from "../../../../core/services/apiService";

const AddStudent = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false);
  
  // Form state for Personal Information section
  const [formData, setFormData] = useState<{
    academic_year_id: string | null;
    admission_number: string;
    admission_date: dayjs.Dayjs | null;
    roll_number: string;
    status: string;
    first_name: string;
    last_name: string;
    class_id: string | null;
    section_id: string | null;
    gender: string;
    date_of_birth: dayjs.Dayjs | null;
    blood_group_id: string | null;
    house_id: string | null;
    religion_id: string | null;
    cast_id: string | null;
    phone: string;
    email: string;
    mother_tongue_id: string | null;
    current_address: string;
    permanent_address: string;
    father_name: string;
    father_email: string;
    father_phone: string;
    father_occupation: string;
    father_image_url: string;
    mother_name: string;
    mother_email: string;
    mother_phone: string;
    mother_occupation: string;
    mother_image_url: string;
  }>({
    academic_year_id: null,
    admission_number: '',
    admission_date: null,
    roll_number: '',
    status: 'Active',
    first_name: '',
    last_name: '',
    class_id: null,
    section_id: null,
    gender: '',
    date_of_birth: null,
    blood_group_id: null,
    house_id: null,
    religion_id: null,
    cast_id: null,
    phone: '',
    email: '',
    mother_tongue_id: null,
    // Address fields
    current_address: '',
    permanent_address: '',
    // Parent fields
    father_name: '',
    father_email: '',
    father_phone: '',
    father_occupation: '',
    father_image_url: '',
    mother_name: '',
    mother_email: '',
    mother_phone: '',
    mother_occupation: '',
    mother_image_url: ''
  });
  
  // Fetch academic years from API
  const { academicYears, loading: academicYearsLoading, error: academicYearsError } = useAcademicYears();
  
  // Fetch classes from API
  const { classes, loading: classesLoading, error: classesError } = useClasses();
  
  // Fetch sections from API
  const { sections, loading: sectionsLoading, error: sectionsError } = useSections();
  
  // Fetch blood groups from API
  const { bloodGroups, loading: bloodGroupsLoading, error: bloodGroupsError } = useBloodGroups();
  
  // Fetch religions from API
  const { religions, loading: religionsLoading, error: religionsError } = useReligions();
  
  // Fetch casts from API
  const { casts, loading: castsLoading, error: castsError } = useCasts();
  
  // Fetch mother tongues from API
  const { motherTongues, loading: motherTonguesLoading, error: motherTonguesError } = useMotherTongues();
  
  // Fetch houses from API
  const { houses, loading: housesLoading, error: housesError } = useHouses();

  // Function to fetch student data for editing
  const fetchStudentData = async (studentId: string) => {
    try {
      setLoadingStudent(true);
      const response = await apiService.getStudentById(studentId);
      console.log('Fetched student data:', response);
      setStudentData(response.data);
      
      // Populate form data with fetched student data
      const student = response.data;
      setFormData({
        academic_year_id: student.academic_year_id ? student.academic_year_id.toString() : null,
        admission_number: student.admission_number || '',
        admission_date: student.admission_date ? dayjs(student.admission_date) : null,
        roll_number: student.roll_number || '',
        status: student.is_active ? 'Active' : 'Inactive',
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        class_id: student.class_id ? student.class_id.toString() : null,
        section_id: student.section_id ? student.section_id.toString() : null,
        gender: student.gender || '',
        date_of_birth: student.date_of_birth ? dayjs(student.date_of_birth) : null,
        blood_group_id: student.blood_group_id ? student.blood_group_id.toString() : null,
        house_id: student.house_id ? student.house_id.toString() : null,
        religion_id: student.religion_id ? student.religion_id.toString() : null,
        cast_id: student.cast_id ? student.cast_id.toString() : null,
        phone: student.phone || '',
        email: student.email || '',
        mother_tongue_id: student.mother_tongue_id ? student.mother_tongue_id.toString() : null,
        // Address fields
        current_address: student.current_address || '',
        permanent_address: student.permanent_address || '',
        // Parent fields
        father_name: student.father_name || '',
        father_email: student.father_email || '',
        father_phone: student.father_phone || '',
        father_occupation: student.father_occupation || '',
        father_image_url: student.father_image_url || '',
        mother_name: student.mother_name || '',
        mother_email: student.mother_email || '',
        mother_phone: student.mother_phone || '',
        mother_occupation: student.mother_occupation || '',
        mother_image_url: student.mother_image_url || ''
      });
    } catch (error: any) {
      console.error('Error fetching student data:', error);
      setSubmitError(error.message || 'Failed to fetch student data');
    } finally {
      setLoadingStudent(false);
    }
  };

  // Effect to handle form data population when dropdown options are loaded
  useEffect(() => {
    if (studentData && isEdit) {
      console.log('Student data available, checking dropdown options...');
      console.log('Blood groups loaded:', bloodGroups.length > 0);
      console.log('Religions loaded:', religions.length > 0);
      console.log('Casts loaded:', casts.length > 0);
      console.log('Mother tongues loaded:', motherTongues.length > 0);
      console.log('Houses loaded:', houses.length > 0);
      
      // Force re-render of form data to ensure dropdowns are populated
      const student = studentData;
      setFormData(prev => ({
        ...prev,
        blood_group_id: student.blood_group_id ? student.blood_group_id.toString() : null,
        house_id: student.house_id ? student.house_id.toString() : null,
        religion_id: student.religion_id ? student.religion_id.toString() : null,
        cast_id: student.cast_id ? student.cast_id.toString() : null,
        mother_tongue_id: student.mother_tongue_id ? student.mother_tongue_id.toString() : null,
        // Address fields
        current_address: student.current_address || '',
        permanent_address: student.permanent_address || '',
      }));
    }
  }, [studentData, bloodGroups, religions, casts, motherTongues, houses, isEdit]);

  // Set current academic year as default when loaded
  useEffect(() => {
    if (academicYears && academicYears.length > 0 && !formData.academic_year_id) {
      console.log('Academic years data:', academicYears);
      // Find the current academic year (where is_current = true)
      const currentAcademicYear = academicYears.find(year => year.is_current === true);

      if (currentAcademicYear) {
        console.log('Current academic year found:', currentAcademicYear);
        setFormData(prev => ({
          ...prev,
          academic_year_id: currentAcademicYear.id.toString()
        }));
      } else {
        console.log('No current academic year found, using first one:', academicYears[0]);
        // Fallback to the first academic year if no current year is found
        setFormData(prev => ({
          ...prev,
          academic_year_id: academicYears[0].id.toString()
        }));
      }
    }
  }, [academicYears, formData.academic_year_id]);

  const [owner, setOwner] = useState<string[]>(["English", "Spanish"]);
  const handleTagsChange2 = (newTags: string[]) => {
    setOwner(newTags);
  };

  const [owner1, setOwner1] = useState<string[]>([]);
  const handleTagsChange3 = (newTags: string[]) => {
    setOwner1(newTags);
  };
  const [owner2, setOwner2] = useState<string[]>([]);
  const handleTagsChange4 = (newTags: string[]) => {
    setOwner2(newTags);
  };
  const [defaultDate, setDefaultDate] = useState<dayjs.Dayjs | null>(null);
  const [newContents, setNewContents] = useState<number[]>([0]);
  const location = useLocation();
  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  const removeContent = (index: any) => {
    setNewContents(newContents.filter((_, i) => i !== index));
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: any) => {
    console.log(`handleInputChange - Field: ${field}, Value:`, value, 'Type:', typeof value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log(`Updated form data for ${field}:`, newData);
      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Debug: Log the raw form data
      console.log('Raw form data before processing:', formData);
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        admission_date: formData.admission_date ? dayjs(formData.admission_date).format('YYYY-MM-DD') : null,
        date_of_birth: formData.date_of_birth ? dayjs(formData.date_of_birth).format('YYYY-MM-DD') : null,
        academic_year_id: formData.academic_year_id ? (typeof formData.academic_year_id === 'string' ? parseInt(formData.academic_year_id) : formData.academic_year_id) : null,
        class_id: formData.class_id ? (typeof formData.class_id === 'string' ? parseInt(formData.class_id) : formData.class_id) : null,
        section_id: formData.section_id ? (typeof formData.section_id === 'string' ? parseInt(formData.section_id) : formData.section_id) : null,
        blood_group_id: formData.blood_group_id ? (typeof formData.blood_group_id === 'string' ? parseInt(formData.blood_group_id) : formData.blood_group_id) : null,
        house_id: formData.house_id ? (typeof formData.house_id === 'string' ? parseInt(formData.house_id) : formData.house_id) : null,
        religion_id: formData.religion_id ? (typeof formData.religion_id === 'string' ? parseInt(formData.religion_id) : formData.religion_id) : null,
        cast_id: formData.cast_id ? (typeof formData.cast_id === 'string' ? parseInt(formData.cast_id) : formData.cast_id) : null,
        mother_tongue_id: formData.mother_tongue_id ? (typeof formData.mother_tongue_id === 'string' ? parseInt(formData.mother_tongue_id) : formData.mother_tongue_id) : null,
        // Gender should be stored as text, not converted to integer
        gender: formData.gender || null,
        // Parent fields
        father_name: formData.father_name || null,
        father_email: formData.father_email || null,
        father_phone: formData.father_phone || null,
        father_occupation: formData.father_occupation || null,
        father_image_url: formData.father_image_url || null,
        mother_name: formData.mother_name || null,
        mother_email: formData.mother_email || null,
        mother_phone: formData.mother_phone || null,
        mother_occupation: formData.mother_occupation || null,
        mother_image_url: formData.mother_image_url || null
      };

      // Debug: Log the processed submit data
      console.log('Processed submit data:', submitData);
      console.log('ID fields debug:', {
        academic_year_id: formData.academic_year_id,
        class_id: formData.class_id,
        section_id: formData.section_id,
        blood_group_id: formData.blood_group_id,
        house_id: formData.house_id,
        religion_id: formData.religion_id,
        cast_id: formData.cast_id,
        mother_tongue_id: formData.mother_tongue_id
      });
      
      let response;
      if (isEdit && id) {
        // Update existing student
        response = await apiService.updateStudent(id, submitData);
        console.log('Student updated successfully:', response);
      } else {
        // Create new student
        response = await apiService.createStudent(submitData);
        console.log('Student created successfully:', response);
      }
      
      // Navigate to student list on success
      navigate(routes.studentList);
    } catch (error: any) {
      console.error('Error saving student:', error);
      setSubmitError(error.message || `Failed to ${isEdit ? 'update' : 'create'} student`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Check if we're in edit mode by looking for the ID parameter or edit path
    const isEditMode = id || location.pathname.includes('/edit-student');
    
    if (isEditMode) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${month}-${day}-${year}`;
      const defaultValue = dayjs(formattedDate);
      setIsEdit(true);
      setOwner(["English"]);
      setOwner1(["Medecine Name"]);
      setOwner2(["Allergy", "Skin Allergy"]);
      setDefaultDate(defaultValue);
      console.log('Edit mode detected, formattedDate:', formattedDate);
      
      // Fetch student data if ID is available
      if (id) {
        console.log('Fetching student data for ID:', id);
        fetchStudentData(id);
      } else {
        console.log('No student ID provided for edit mode');
        setSubmitError('No student ID provided for editing');
      }
    } else {
      setIsEdit(false);
      setDefaultDate(null);
    }
  }, [location.pathname, id]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">{isEdit ? "Edit" : "Add"} Student</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentList}>Students</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {isEdit ? "Edit" : "Add"} Student
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}
          {submitError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="ti ti-alert-circle me-2"></i>
              {submitError}
              <button type="button" className="btn-close" onClick={() => setSubmitError(null)}></button>
            </div>
          )}
          {loadingStudent && (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading student data...</p>
            </div>
          )}
          {!loadingStudent && (
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-info-square-rounded fs-16" />
                      </span>
                      <h4 className="text-dark">Personal Information</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                          <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                            <i className="ti ti-photo-plus fs-16" />
                          </div>
                          <div className="profile-upload">
                            <div className="profile-uploader d-flex align-items-center">
                              <div className="drag-upload-btn mb-3">
                                Upload
                                <input
                                  type="file"
                                  className="form-control image-sign"
                                  multiple
                                />
                              </div>
                              <Link to="#" className="btn btn-primary mb-3">
                                Remove
                              </Link>
                            </div>
                            <p className="fs-12">
                              Upload image size 4MB, Format JPG, PNG, SVG
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row row-cols-xxl-5 row-cols-md-6">
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Academic Year</label>
                          {academicYearsLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading academic years...
                            </div>
                          ) : academicYearsError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {academicYearsError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={academicYears.map(year => ({
                                value: year.id.toString(),
                                label: year.year_name
                              }))}
                              value={formData.academic_year_id}
                              onChange={(value) => handleInputChange('academic_year_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.admission_number}
                            onChange={(e) => handleInputChange('admission_number', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Admission Date</label>
                          <div className="input-icon position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              value={formData.admission_date}
                              onChange={(date) => handleInputChange('admission_date', date)}
                              placeholder="Select Date"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Roll Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.roll_number}
                            onChange={(e) => handleInputChange('roll_number', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <CommonSelect
                            className="select"
                            options={status}
                            value={formData.status}
                            onChange={(value) => handleInputChange('status', value)}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Class</label>
                          {classesLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading classes...
                            </div>
                          ) : classesError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {classesError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={classes.map(cls => ({
                                value: cls.id.toString(),
                                label: cls.class_name
                              }))}
                              value={formData.class_id}
                              onChange={(value) => handleInputChange('class_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Section</label>
                          {sectionsLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading sections...
                            </div>
                          ) : sectionsError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {sectionsError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={sections.map(section => ({
                                value: section.id.toString(),
                                label: section.section_name
                              }))}
                              value={formData.section_id}
                              onChange={(value) => handleInputChange('section_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Gender</label>
                          <CommonSelect
                            className="select"
                            options={gender}
                            value={formData.gender}
                            onChange={(value) => handleInputChange('gender', value)}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Date of Birth</label>
                          <div className="input-icon position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              value={formData.date_of_birth}
                              onChange={(date) => handleInputChange('date_of_birth', date)}
                              placeholder="Select Date"
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Blood Group</label>
                          {bloodGroupsLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading blood groups...
                            </div>
                          ) : bloodGroupsError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {bloodGroupsError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={bloodGroups.map(bg => ({
                                value: bg.id.toString(),
                                label: bg.blood_group
                              }))}
                              value={formData.blood_group_id}
                              onChange={(value) => handleInputChange('blood_group_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">House</label>
                          {housesLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading houses...
                            </div>
                          ) : housesError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {housesError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={houses.map(h => ({
                                value: h.id.toString(),
                                label: h.house_name
                              }))}
                              value={formData.house_id}
                              onChange={(value) => handleInputChange('house_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Religion</label>
                          {religionsLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading religions...
                            </div>
                          ) : religionsError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {religionsError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={religions.map(religion => ({
                                value: religion.id.toString(),
                                label: religion.religion_name
                              }))}
                              value={formData.religion_id}
                              onChange={(value) => handleInputChange('religion_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category</label>
                          {castsLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading categories...
                            </div>
                          ) : castsError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {castsError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={casts.map(cast => ({
                                value: cast.id.toString(),
                                label: cast.cast_name
                              }))}
                              value={formData.cast_id}
                              onChange={(value) => handleInputChange('cast_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Primary Contact Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mother Tongue</label>
                          {motherTonguesLoading ? (
                            <div className="form-control">
                              <i className="ti ti-loader ti-spin me-2"></i>
                              Loading mother tongues...
                            </div>
                          ) : motherTonguesError ? (
                            <div className="form-control text-danger">
                              <i className="ti ti-alert-circle me-2"></i>
                              Error: {motherTonguesError}
                            </div>
                          ) : (
                            <CommonSelect
                              className="select"
                              options={motherTongues.map(mt => ({
                                value: mt.id.toString(),
                                label: mt.language_name
                              }))}
                              value={formData.mother_tongue_id}
                              onChange={(value) => handleInputChange('mother_tongue_id', value)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-xxl col-xl-3 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Language Known</label>
                          <TagInput
                           initialTags ={owner}
                            onTagsChange={handleTagsChange2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Personal Information */}
                {/* Parents & Guardian Information */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-user-shield fs-16" />
                      </span>
                      <h4 className="text-dark">
                        Parents &amp; Guardian Information
                      </h4>
                    </div>
                  </div>
                  <div className="card-body pb-0">
                    <div className="border-bottom mb-3">
                      <h5 className="mb-3">Father’s Info</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div>
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    className="form-control image-sign"
                                    multiple
                                  />
                                </div>
                                <Link to="#" className="btn btn-primary mb-3">
                                  Remove
                                </Link>
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG, SVG
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Father Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.father_name}
                              onChange={(e) => handleInputChange('father_name', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.father_email}
                              onChange={(e) => handleInputChange('father_email', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.father_phone}
                              onChange={(e) => handleInputChange('father_phone', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Father Occupation
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.father_occupation}
                              onChange={(e) => handleInputChange('father_occupation', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-bottom mb-3">
                      <h5 className="mb-3">Mother’s Info</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div>
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    className="form-control image-sign"
                                    multiple
                                  />
                                </div>
                                <Link to="#" className="btn btn-primary mb-3">
                                  Remove
                                </Link>
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG, SVG
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Mother Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.mother_name}
                              onChange={(e) => handleInputChange('mother_name', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.mother_email}
                              onChange={(e) => handleInputChange('mother_email', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.mother_phone}
                              onChange={(e) => handleInputChange('mother_phone', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Mother Occupation
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.mother_occupation}
                              onChange={(e) => handleInputChange('mother_occupation', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-3">Guardian Details</h5>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-2">
                            <div className="d-flex align-items-center flex-wrap">
                              <label className="form-label text-dark fw-normal me-2">
                                If Guardian Is
                              </label>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="parents"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="parents"
                                >
                                  Parents
                                </label>
                              </div>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="guardian"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="guardian"
                                >
                                  Guardian
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="guardian"
                                  id="other"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="other"
                                >
                                  Others
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div>
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    type="file"
                                    className="form-control image-sign"
                                    multiple
                                  />
                                </div>
                                <Link to="#" className="btn btn-primary mb-3">
                                  Remove
                                </Link>
                              </div>
                              <p className="fs-12">
                                Upload image size 4MB, Format JPG, PNG, SVG
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Guardian Name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit ? "Jerald Vicinius" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Guardian Relation
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={isEdit ? "Uncle" : undefined}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit ? "+1 45545 46464" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              defaultValue={
                                isEdit ? "jera@example.com" : undefined
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Occupation</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={isEdit ? "Mechanic" : undefined}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                isEdit
                                  ? "3495 Red Hawk Road, Buffalo Lake, MN 55314"
                                  : undefined
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Parents & Guardian Information */}
                {/* Sibilings */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-users fs-16" />
                      </span>
                      <h4 className="text-dark">Sibilings</h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="addsibling-info">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-2">
                            <label className="form-label">Sibling Info</label>
                            <div className="d-flex align-items-center flex-wrap">
                              <label className="form-label text-dark fw-normal me-2">
                                Is Sibling studying in the same school
                              </label>
                              <div className="form-check me-3 mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sibling"
                                  id="yes"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="yes"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sibling"
                                  id="no"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="no"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        {newContents.map((_, index) => (
                          <div key={index} className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Name</label>
                                  <CommonSelect
                                    className="select"
                                    options={names}
                                    defaultValue={isEdit ? names[0] : undefined}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">Roll No</label>
                                  <CommonSelect
                                    className="select"
                                    options={rollno}
                                    defaultValue={
                                      isEdit ? rollno[0] : undefined
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Admission No
                                  </label>
                                  <CommonSelect
                                    className="select"
                                    options={AdmissionNo}
                                    defaultValue={
                                      isEdit ? AdmissionNo[0] : undefined
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex align-items-center">
                                    <div className="w-100">
                                      <label className="form-label">
                                        Class
                                      </label>
                                      <CommonSelect
                                        className="select"
                                        options={allClass}
                                        defaultValue={
                                          isEdit ? allClass[0] : undefined
                                        }
                                      />
                                    </div>
                                    {newContents.length > 1 && (
                                      <div>
                                        <label className="form-label">
                                          &nbsp;
                                        </label>
                                        <Link
                                          to="#"
                                          className="trash-icon ms-3"
                                          onClick={() => removeContent(index)}
                                        >
                                          <i className="ti ti-trash-x" />
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-top pt-3">
                      <Link
                        to="#"
                        onClick={addNewContent}
                        className="add-sibling btn btn-primary d-inline-flex align-items-center"
                      >
                        <i className="ti ti-circle-plus me-2" />
                        Add New
                      </Link>
                    </div>
                  </div>
                </div>
                {/* /Sibilings */}
                {/* Address */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-map fs-16" />
                      </span>
                      <h4 className="text-dark">Address</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Current Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.current_address || ''}
                            onChange={(e) => handleInputChange('current_address', e.target.value)}
                            placeholder="Enter current address"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Permanent Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.permanent_address || ''}
                            onChange={(e) => handleInputChange('permanent_address', e.target.value)}
                            placeholder="Enter permanent address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Address */}
                {/* Transport Information */}
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-bus-stop fs-16" />
                      </span>
                      <h4 className="text-dark">Transport Information</h4>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Route</label>
                          <CommonSelect
                            className="select"
                            options={route}
                            defaultValue={isEdit ? route[0] : undefined}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Vehicle Number</label>
                          <CommonSelect
                            className="select"
                            options={VehicleNumber}
                            defaultValue={isEdit ? VehicleNumber[0] : undefined}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Pickup Point</label>
                          <CommonSelect
                            className="select"
                            options={PickupPoint}
                            defaultValue={isEdit ? PickupPoint[0] : undefined}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Transport Information */}
                {/* Hostel Information */}
                <div className="card">
                  <div className="card-header bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building-fortress fs-16" />
                      </span>
                      <h4 className="text-dark">Hostel Information</h4>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Hostel</label>
                          <CommonSelect
                            className="select"
                            options={Hostel}
                            defaultValue={isEdit ? Hostel[0] : undefined}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Room No</label>
                          <CommonSelect
                            className="select"
                            options={roomNO}
                            defaultValue={isEdit ? roomNO[0] : undefined}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Hostel Information */}
                {/* Documents */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-file fs-16" />
                      </span>
                      <h4 className="text-dark">Documents</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label mb-1">
                              Medical Condition
                            </label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                              <i className="ti ti-file-upload me-1" />
                              Change
                              <input
                                type="file"
                                className="form-control image_sign"
                                multiple
                              />
                            </div>
                            {isEdit ? (
                              <p className="mb-2">BirthCertificate.pdf</p>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label mb-1">
                              Upload Transfer Certificate
                            </label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2">
                              <i className="ti ti-file-upload me-1" />
                              Upload Document
                              <input
                                type="file"
                                className="form-control image_sign"
                                multiple
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Documents */}
                {/* Medical History */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-medical-cross fs-16" />
                      </span>
                      <h4 className="text-dark">Medical History</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-2">
                          <label className="form-label">
                            Medical Condition
                          </label>
                          <div className="d-flex align-items-center flex-wrap">
                            <label className="form-label text-dark fw-normal me-2">
                              Medical Condition of a Student
                            </label>
                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="good"
                                defaultChecked
                              />
                              <label
                                className="form-check-label"
                                htmlFor="good"
                              >
                                Good
                              </label>
                            </div>
                            <div className="form-check me-3 mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="bad"
                              />
                              <label className="form-check-label" htmlFor="bad">
                                Bad
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="condition"
                                id="others"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="others"
                              >
                                Others
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Allergies</label>

                        <TagInput
                          initialTags={owner1}
                          onTagsChange={handleTagsChange3}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Medications</label>
                        <TagInput
                          initialTags={owner2}
                          onTagsChange={handleTagsChange4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Medical History */}
                {/* Previous School details */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <h4 className="text-dark">Previous School Details</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">School Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              isEdit ? "Oxford Matriculation, USA" : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              isEdit
                                ? "1852 Barnes Avenue, Cincinnati, OH 45202"
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Previous School details */}
                {/* Other Details */}
                <div className="card">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-building-bank fs-16" />
                      </span>
                      <h4 className="text-dark">Other Details</h4>
                    </div>
                  </div>
                  <div className="card-body pb-1">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              isEdit ? "Bank of America" : undefined
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label className="form-label">Branch</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={isEdit ? "Cincinnati" : undefined}
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="mb-3">
                          <label className="form-label">IFSC Number</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={isEdit ? "BOA83209832" : undefined}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Other Information
                          </label>
                          <textarea
                            className="form-control"
                            rows={3}
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Other Details */}
                <div className="text-end">
                  <button type="button" className="btn btn-light me-3">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Student' : 'Add Student')}
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default AddStudent;
