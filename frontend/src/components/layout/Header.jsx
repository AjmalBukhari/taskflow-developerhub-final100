import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ onSearch, onLogout }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // ================= DEBOUNCE SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // ================= HANDLERS =================
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    window.location.reload();
  };

  return (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">

      {/* LEFT: LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-lg font-bold">
          T
        </div>
        <h1 className="text-lg font-semibold">TaskFlow</h1>
      </div>

      {/* CENTER: SEARCH */}
      <div className="w-1/3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      {/* RIGHT: PROFILE */}
      <div className="relative">
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:scale-105 transition"
        >
          👤
        </div>

        {/* DROPDOWN */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg overflow-hidden border"
            >
              <div className="px-4 py-2 text-sm text-gray-600 border-b">
                Signed in
              </div>

              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => alert('Account page (not implemented)')}
              >
                Account
              </button>

              <button
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}