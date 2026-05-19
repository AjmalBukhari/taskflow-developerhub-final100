const User = require('../models/User');
const Notification = require('../models/Notification');
const AppError = require('../utils/appError');

// ================= GET NOTIFICATIONS =================
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('taskId', 'title');

    res.json({
      status: 'success',
      results: notifications.length,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

// ================= MARK AS READ =================
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.id
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return next(AppError('Notification not found', 404));
    }

    res.json({
      status: 'success',
      data: notification
    });
  } catch (err) {
    next(err);
  }
};

// ================= MARK ALL AS READ =================
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );

    res.json({
      status: 'success',
      message: `${result.modifiedCount} notifications marked as read`
    });
  } catch (err) {
    next(err);
  }
};

// ================= DELETE NOTIFICATION =================
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return next(AppError('Notification not found', 404));
    }

    res.json({
      status: 'success',
      message: 'Notification deleted'
    });
  } catch (err) {
    next(err);
  }
};

// ================= GET UNREAD COUNT =================
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false
    });

    res.json({
      status: 'success',
      data: { unreadCount: count }
    });
  } catch (err) {
    next(err);
  }
};