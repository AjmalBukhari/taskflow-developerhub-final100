import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAllTasks } from "../../services/api";
import ProgressBar from "../ProgressBar";

export default function Dashboard({ showToast, onChange }) {
  const [tasks, setTasks] = useState([]);


  // ================= FETCH =================
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await getAllTasks({});
      setTasks(data);
    } catch {
      showToast("Failed to load tasks", "error");
    } finally {
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ================= STATS =================
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  const Card = ({ title, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-semibold">{value}</h3>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <ProgressBar tasks={tasks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Tasks" value={total} />
        <Card title="Completed" value={completed} />
        <Card title="Pending" value={pending} />
      </div>

      {/* TASK LIST */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Tasks</h2>

        {tasks.slice(0, 5).map((task) => (
          <div
            key={task._id}
            className="border p-3 rounded-lg flex justify-between"
          >
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-xs text-gray-500">{task.description}</p>
            </div>

            <span className="text-xs text-gray-500">{task.status}</span>
          </div>
        ))}
        <button onClick={() => onChange('All Tasks')} className="border px-3 py-2 rounded m-3 hover:bg-gray-100 transition">See All Tasks</button>
      </div>
    </motion.div>
  );
}
