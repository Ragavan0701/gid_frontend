import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import Swal from "sweetalert2";
import api from "../api/todoApi"; // ✅ use Axios instance

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

        const response = await api.get("/todo"); // ✅ replaced fetch with axios instance
        setTasks(response.data);
        console.log(response.data);
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
      const confirmed = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!confirmed.isConfirmed) return;

      await api.delete(`api/todo/delete`, { params: { id } }); // ✅ axios delete

      setTasks((prev) => prev.filter((task) => task.id !== id));

      Swal.fire({
        icon: "success",
        title: "Task deleted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete task.",
        text: "Something went wrong. Try again.",
      });
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
