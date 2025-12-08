const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');


router.get('/', salesController.getSales);
router.get('/filters', salesController.getFilterOptions);
router.get('/statistics', salesController.getStatistics);
router.get('/age-range', salesController.getAgeRange);

module.exports = router;