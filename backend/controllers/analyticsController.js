const Task = require('../models/Task');
const AppError = require('../utils/appError');

// ================= GET ANALYTICS OVERVIEW =================
exports.getAnalyticsOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get task counts by status
    const statusCounts = await Task.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total tasks
    const totalTasks = await Task.countDocuments({ user: userId, isDeleted: false });

    // Get completed tasks
    const completedTasks = await Task.countDocuments({ 
      user: userId, 
      isDeleted: false, 
      status: 'Completed' 
    });

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: userId,
      isDeleted: false,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueToday = await Task.countDocuments({
      user: userId,
      isDeleted: false,
      dueDate: { $gte: today, $lt: tomorrow }
    });

    // Get shared tasks count
    const sharedTasks = await Task.countDocuments({
      sharedWith: userId,
      isDeleted: false
    });

    // Format status counts
    const statusMap = { Pending: 0, 'In Progress': 0, Completed: 0 };
    statusCounts.forEach(item => {
      statusMap[item._id] = item.count;
    });

    res.json({
      status: 'success',
      data: {
        totalTasks,
        completedTasks,
        pendingTasks: statusMap.Pending,
        inProgressTasks: statusMap['In Progress'],
        overdueTasks,
        dueToday,
        sharedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET ANALYTICS TRENDS =================
exports.getAnalyticsTrends = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
        break;
      default:
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
    }

    // Get task creation trends
    const creationTrends = await Task.aggregate([
      { $match: { user: userId, createdAt: dateFilter } },
      { $group: { 
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
        }, 
        count: { $sum: 1 } 
      }},
      { $sort: { '_id._id': 1 } }
    ]);

    // Get task completion trends
    const completionTrends = await Task.aggregate([
      { $match: { user: userId, status: 'Completed', createdAt: dateFilter } },
      { $group: { 
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
        }, 
        count: { $sum: 1 } 
      }},
      { $sort: { '_id._id': 1 } }
    ]);

    // Get status distribution for the period
    const statusDistribution = await Task.aggregate([
      { $match: { user: userId, createdAt: dateFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      status: 'success',
      data: {
        period,
        creationTrends,
        completionTrends,
        statusDistribution
      }
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET USER ANALYTICS =================
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's task statistics
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    // Get monthly trends for the last 6 months
    const monthlyTrends = await Task.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get priority distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      status: 'success',
      data: {
        stats,
        monthlyTrends,
        priorityDistribution
      }
    });
  } catch (err) {
    next(err);
  }
};