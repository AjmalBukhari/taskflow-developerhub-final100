import { motion } from 'framer-motion';
import TaskForm from '../TaskForm';

export default function AddTask({ showToast, onTaskAdded }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto"
    >

      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">
          Add New Task
        </h1>
        <p className="text-sm text-gray-500">
          Create and organize your tasks efficiently
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <TaskForm
          onClose={() => {}}
          onSaved={() => {
            showToast('Task created successfully');

            if (onTaskAdded) {
              onTaskAdded(); // optional navigation
            }
          }}
          showToast={showToast}
        />

      </div>

    </motion.div>
  );
}