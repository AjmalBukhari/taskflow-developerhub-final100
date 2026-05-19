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
router.get('/bin', auth, taskController.getBinTasks);

// ================= RESTORE TASK =================
router.put('/restore/:id', auth, taskController.restoreTask);

// ================= PERMANENT DELETE =================
router.delete('/permanent/:id', auth, taskController.permanentDelete);

// ================= SHARE TASK =================
router.put('/:id/share', auth, taskController.shareTask);

// ================= GET SHARED TASKS =================
router.get('/shared', auth, taskController.getSharedTasks);

// ======================================================
// ================= GET SINGLE TASK (with sharing) =================
// ======================================================
router.get('/:id', auth, taskController.getTask);

// ======================================================
// ================= UPDATE TASK =================
// ======================================================
router.put('/:id', auth, taskController.updateTask);

// ======================================================
// ================= DELETE TASK =================
// ======================================================
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;