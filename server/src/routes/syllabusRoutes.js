const express = require('express');
const {
  getAllSyllabus,
  getSyllabusById,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus
} = require('../controllers/syllabusController');

const router = express.Router();

router.get('/', getAllSyllabus);
router.get('/:id', getSyllabusById);
router.post('/', createSyllabus);
router.put('/:id', updateSyllabus);
router.delete('/:id', deleteSyllabus);

module.exports = router;
