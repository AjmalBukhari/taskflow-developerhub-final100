const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const { validateTask, handleValidation } = require('../middleware/validate');
const auth = require('../middleware/auth');


// ================= CREATE TASK =================
router.post('/', auth, validateTask, handleValidation, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(task); // ✅ only one response

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ================= GET ALL TASKS =================
router.get('/', auth, async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {
      user: req.user.id,
      isDeleted: false
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

// ======================================================
// ⚠️ IMPORTANT: SPECIAL ROUTES MUST COME BEFORE "/:id"
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
router.put('/restore/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isDeleted = false;
    task.deletedAt = null;

    await task.save();

    res.json({ message: 'Task restored' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= PERMANENT DELETE =================
router.delete('/permanent/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: true
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task permanently deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ======================================================
// ================= NORMAL CRUD =================
// ======================================================


// ================= CREATE TASK =================
router.post('/', auth, validateTask, handleValidation, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ================= GET ALL TASKS =================
router.get('/', auth, async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {
      user: req.user.id,
      isDeleted: false
    };

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


// ================= GET SINGLE TASK =================
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false
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


// ================= UPDATE TASK =================
router.put('/:id', auth, validateTask, handleValidation, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        isDeleted: false
      },
      req.body,
      { new: true, runValidators: true }
    );

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


// ================= SOFT DELETE =================
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.isDeleted = true;
    task.deletedAt = new Date();

    await task.save();

    res.json({ message: 'Task moved to bin' });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});


module.exports = router;