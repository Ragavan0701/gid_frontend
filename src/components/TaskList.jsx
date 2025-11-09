import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          console.error("⚠️ No token found — please log in first");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/api/todo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        
        setTasks(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const completeTask = async (id) => {
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );
  };

  const removeTask = async (id) => {
    try {
      const confirmed = confirm("Do you want to delete this task?");
      if (!confirmed) return;

      const token = localStorage.getItem("token"); // ✅ get token again
      if (!token) {
        alert("Please log in again!");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/todo/delete?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token here too
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task.id !== id));
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10 animate-pulse">
        Loading tasks...
      </div>
    );

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            completeTask={completeTask}
            removeTask={removeTask}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 mt-10">No tasks found</p>
      )}
    </div>
  );
}
