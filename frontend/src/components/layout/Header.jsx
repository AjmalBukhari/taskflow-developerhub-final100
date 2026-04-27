import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ onSearch, onLogout, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);


  // ================= HANDLERS =================
  const handleLogout = () => {
    localStorage.removeItem("token");
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
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate && onNavigate("Account");
                }}
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
