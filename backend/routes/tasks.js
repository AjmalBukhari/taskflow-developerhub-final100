const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { validateTask, handleValidation } = require('../middleware/validate');
const auth = require('../middleware/auth');

// ======================================================
// ================= CREATE TASK =================
// ======================================================
router.post('/', auth, validateTask, handleValidation, taskController.createTask);

// ======================================================
// ================= GET ALL TASKS =================
// ======================================================
router.get('/', auth, taskController.getAllTasks);

// ======================================================
// ⚠️ SPECIAL ROUTES MUST COME BEFORE "/:id"
// ======================================================

// ================= GET BIN TASKS =================
router.get('/bin', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      isDeleted: true
    }).sort({ deletedAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= RESTORE TASK =================
router.put('/restore/:id', auth, taskController.restoreTask);

// ================= PERMANENT DELETE =================
router.delete('/permanent/:id', auth, taskController.permanentDelete);

// ================= SHARE TASK =================
router.put('/:id/share', auth, taskController.shareTask);

// ================= GET SHARED TASKS =================
router.get('/shared', auth, taskController.getSharedTasks);
    const tasks = await Task.find({
      sharedWith: req.user.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

// ======================================================
// ================= GET SINGLE TASK (with sharing) =================
// ======================================================
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false,
      $or: [
        { user: req.user.id },
        { sharedWith: req.user.id }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

// ======================================================
// ================= UPDATE TASK =================
// ======================================================
router.put('/:id', auth, taskController.updateTask);

// ======================================================
// ================= DELETE TASK =================
// ======================================================
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;