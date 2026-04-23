import { useState } from 'react';
import { createTask, updateTask } from '../services/api';

export default function TaskForm({ task, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Pending',
    dueDate: task?.dueDate?.slice(0, 10) || '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert('Title required');

    if (task) {
      await updateTask(task._id, form);
    } else {
      await createTask(form);
    }

    onSaved();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-2"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          {task ? 'Update' : 'Create'}
        </button>

        <button onClick={onClose} className="border px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}