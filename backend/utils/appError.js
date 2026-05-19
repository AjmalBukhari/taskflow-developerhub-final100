const AppError = (message, status = 500) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

module.exports = AppError;

// ================= USAGE =================
// return next(AppError('Task not found', 404));