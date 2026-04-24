import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';


export default function MainLayout({ children, onSearch, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ================= LEFT SIDEBAR ================= */}
      <Sidebar
        active={activeMenu}
        onChange={(menu) => setActiveMenu(menu)}
      />

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <Header
          onSearch={onSearch}
          onLogout={onLogout}
        />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">

          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="max-w-6xl mx-auto"
          >
            {/*
              children should be controlled by parent (App.jsx)
              OR you can switch here based on activeMenu
            */}
            {typeof children === 'function'
              ? children(activeMenu)
              : children}
          </motion.div>

        </main>
      </div>

    </div>
  );
}