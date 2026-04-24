import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createTask, updateTask } from '../services/api';

export default function TaskForm({ task, onClose, onSaved, showToast }) {

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Low',
    dueDate: '',
    pinned: false
  });

  const [loading, setLoading] = useState(false);

  // ================= PREFILL (EDIT MODE) =================
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Low',
        dueDate: task.dueDate?.slice(0, 10) || '',
        pinned: task.pinned || false
      });
    }
  }, [task]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return showToast('Title is required', 'warning');
    }

    try {
      setLoading(true);

      if (task) {
        await updateTask(task._id, form);
        showToast('Task updated');
      } else {
        await createTask(form);
        showToast('Task created');
      }

      onSaved();

    } catch (err) {
      showToast(
        err.response?.data?.message || 'Error saving task',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white p-5 rounded-xl shadow-sm border max-w-xl mx-auto"
    >

      {/* TITLE */}
      <h2 className="text-lg font-semibold mb-4">
        {task ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div className="space-y-3">

        {/* TITLE INPUT */}
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* STATUS + PRIORITY */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* DATE */}
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
        />

        {/* PIN */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="pinned"
            checked={form.pinned}
            onChange={handleChange}
          />
          Pin this task
        </label>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : task
                ? 'Update'
                : 'Create'}
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>

      </div>
    </motion.div>
  );
}