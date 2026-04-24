import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAllTasks } from "../../services/api";
import ProgressBar from "../ProgressBar";
import SearchBar from "../SearchBar";

export default function Dashboard({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data } = await getAllTasks({
        search,
        status,
      });

      setTasks(data);
    } catch (err) {
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status]);

  // ================= STATS =================
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  // ================= CARD COMPONENT =================
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
      {/* SEARCH + FILTER */}
      <SearchBar onSearch={setSearch} onFilter={setStatus} />

      {/* PROGRESS */}
      <ProgressBar tasks={tasks} />

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total Tasks" value={total} />
        <Card title="Completed" value={completed} />
        <Card title="Pending" value={pending} />
      </div>

      {/* TASK LIST */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Tasks</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-gray-400">No tasks found</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>

                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }
                `}
                >
                  {task.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
