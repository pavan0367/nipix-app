const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, reportController.createReport);
router.get('/', authMiddleware, adminMiddleware, reportController.getAllReports);
router.put('/:id', authMiddleware, adminMiddleware, reportController.updateReportStatus);

module.exports = router;
