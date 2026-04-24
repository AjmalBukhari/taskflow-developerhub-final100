import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, onFilter }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  // ================= DEBOUNCE =================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // ================= FILTER =================
  const handleFilter = (value) => {
    setStatus(value);
    if (onFilter) onFilter(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col md:flex-row gap-3 mb-4"
    >

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      {/* STATUS FILTER */}
      <select
        value={status}
        onChange={(e) => handleFilter(e.target.value)}
        className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

    </motion.div>
  );
}