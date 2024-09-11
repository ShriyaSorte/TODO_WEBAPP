import React, { useState, useEffect } from "react";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from API (assuming you have an endpoint set up)
    // Example: axios.get('/api/tasks').then(response => setTasks(response.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="p-4 mb-2 bg-white shadow rounded-md">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTasks;
