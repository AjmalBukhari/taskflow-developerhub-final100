import Task from "../models/Task.js";
import asyncHandler from "../middleware/asyncHandler.js";

// Create Task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json(task);
});

// Get All Tasks
export const getTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: "i" } },
          { description: { $regex: req.query.keyword, $options: "i" } },
        ],
      }
    : {};

  const statusFilter = req.query.status
    ? { status: req.query.status }
    : {};

  const query = {
    user: req.user._id,
    ...keyword,
    ...statusFilter,
  };

  const count = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    tasks,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

// Get Single Task
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
});

// Update Task
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
});

// Delete Task
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.json({ message: "Task removed" });
});

