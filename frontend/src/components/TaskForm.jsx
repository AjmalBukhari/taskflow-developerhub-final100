import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createTask, updateTask, uploadAttachment } from '../services/api';

const initialState = {
  title: '', description: '', status: 'Pending',
  priority: 'Low', dueDate: '', pinned: false
};

export default function TaskForm({ task, onClose, onSaved, showToast }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '', description: task.description || '',
        status: task.status || 'Pending', priority: task.priority || 'Low',
        dueDate: task.dueDate?.slice(0, 10) || '', pinned: task.pinned || false
      });
    } else setForm(initialState);
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileSelect = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return showToast('Title is required', 'warning');
    try {
      setLoading(true);
      let savedTask;
      if (task) {
        await updateTask(task.id, form);
        showToast(`Task "${task.title}" updated`, 'info');
        savedTask = task;
      } else {
        const res = await createTask(form);
        savedTask = res?.data?.data;
        setForm(initialState);
        setFiles([]);
      }
      if (savedTask?.id && files.length > 0) {
        for (const file of files) {
          const fd = new FormData();
          fd.append('file', file);
          try {
            await uploadAttachment(savedTask.id, fd);
          } catch (err) {
            showToast(`Failed to upload ${file.name}: ${err.response?.data?.message || err.message}`, 'error');
          }
        }
        showToast(`Task created with ${files.length} file(s)`, 'success');
      } else if (!task) {
        showToast('Task created', 'success');
      }
      if (onSaved) onSaved(savedTask?.id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:shadow-gray-900/50 border dark:border-gray-700 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold dark:text-gray-100 mb-4">{isEdit ? 'Edit Task' : 'Add New Task'}</h2>
      <div className="space-y-3">
        <input name="title" placeholder="Task title" value={form.title} onChange={handleChange}
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400" />
        <div className="grid grid-cols-2 gap-3">
          <select name="status" value={form.status} onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded">
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
          <select name="priority" value={form.priority} onChange={handleChange}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded">
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2 rounded" />
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} /> Pin this task
        </label>

        {!isEdit && (
          <div className="border-t dark:border-gray-700 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <label className="cursor-pointer text-xs px-3 py-1.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/60 transition">
                + Attach Files
                <input ref={fileRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
              </label>
              {files.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{files.length} file(s) selected</span>
              )}
            </div>
            {files.length > 0 && (
              <div className="space-y-1 mb-2 max-h-28 overflow-y-auto">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                    <div className="flex-1 truncate mr-2 text-gray-700 dark:text-gray-300">{f.name}</div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-400 dark:text-gray-500">{formatSize(f.size)}</span>
                      <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600">&times;</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button onClick={onClose} className="border dark:border-gray-600 dark:text-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </motion.div>
  );
}
