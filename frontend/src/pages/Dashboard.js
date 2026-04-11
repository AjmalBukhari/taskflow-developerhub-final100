import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const { logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={logout}>Logout</button>

      {tasks.map((task) => (
        <div key={task._id}>
          <h4>{task.title}</h4>
          <p>{task.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;