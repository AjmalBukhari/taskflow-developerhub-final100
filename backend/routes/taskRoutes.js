import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { validate } from "../middleware/validateMiddleware.js";
import { taskSchema } from "../validators/taskValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, validate(taskSchema), createTask)
  .get(protect, getTasks);

router.route("/:id")
  .get(protect, getTaskById)
  .put(protect, validate(taskSchema), updateTask)
  .delete(protect, deleteTask);

export default router;