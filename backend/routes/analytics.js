const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// ================= GET ANALYTICS OVERVIEW =================
router.get('/overview', auth, analyticsController.getAnalyticsOverview);

// ================= GET ANALYTICS TRENDS =================
router.get('/trends', auth, analyticsController.getAnalyticsTrends);

// ================= GET USER ANALYTICS =================
router.get('/user', auth, analyticsController.getUserAnalytics);

// ================= GET PRIORITY DISTRIBUTION =================
router.get('/priority', auth, analyticsController.getPriorityDistribution);

module.exports = router;
