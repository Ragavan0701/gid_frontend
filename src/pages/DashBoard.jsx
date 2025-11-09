import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import ActivityFeed from "../components/ActivityFeed";
import RightPanel from "../components/RightPanel";
import TaskStatsOverview from "../components/TaskStatsOverview";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask"; // ✅ added import
import Swal from "sweetalert2";

export default function DashBoard({ isLoggedin }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("Tasks");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // ✅ added

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchTasks();
      const interval = setInterval(() => {
        fetchTasks();
      }, 500000);

      return () => clearInterval(interval);
    }
  }, [token]);

  // ✅ update existing task
const updateTaskInBackend = async (task) => {
  console.log("🧩 Sending:", task);

  try {
    const response = await fetch("http://localhost:8080/api/todo/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      }),
    });

    if (!response.ok) throw new Error("Failed to update task");

    Swal.fire("Updated!", "Task updated successfully!", "success");
    await fetchTasks();
    setEditingTask(null);
    setActiveView("Tasks");
  } catch (error) {
    console.error("Error updating task:", error);
    Swal.fire("Error!", "Unable to update task.", "error");
  }
};


  const fetchTasks = async () => {
    if (!token) {
      console.warn("🚫 No token found — please log in first");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/todo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401 || response.status === 403) {
        Swal.fire("Session Expired", "Please log in again.", "warning");
        localStorage.removeItem("token");
        window.location.reload();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Swal.fire("Oops!", "Unable to connect to server. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ✅ Update task status
  const updateTaskStatus = async (id, title,status) => {
    if (!token) {
      Swal.fire("Unauthorized!", "Please log in first.", "warning");
      return;
    }
    console.log("in status :", {id,status});
    try {
      const response = await fetch("http://localhost:8080/api/todo/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id:`${id}`, status }),
      });

      if (!response.ok) throw new Error("Failed to update task status");

      await fetchTasks();
      setActivities((prev) => [`📝 Updated "${title}" → ${status}`, ...prev]);
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Couldn't update task status.", "error");
    }
  };

  // ✅ Delete task
  const deleteTask = async (id, title) => {
    if (!token) {
      Swal.fire("Unauthorized!", "Please log in first.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/todo/delete?id=${encodeURIComponent(id)}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to delete task");

        await fetchTasks();
        setActivities((prev) => [`🗑️ Deleted task: "${title}"`, ...prev]);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // ✅ Add new task
  const addTaskToBackend = async (task) => {
    if (!token) return alert("Please log in first!");

    try {
      const response = await fetch("http://localhost:8080/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error("Failed to add task");

      Swal.fire("Success!", "Task added successfully!", "success");
      await fetchTasks();
      setShowAddTask(false);
      setActivities((prev) => [`🆕 Added task: "${task.title}"`, ...prev]);
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire("Error!", "Unable to add task.", "error");
    }
  };

  // ✅ Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const localDue = new Date(due.getTime() - due.getTimezoneOffset() * 60000);
    return localDue.toISOString().split("T")[0] === todayStr;
  }).length;

  // ✅ Search
  const handleSearchChange = async (query) => {
    if (!query.trim()) {
      fetchTasks();
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/todo/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setTasks(data);
      setActiveView("Tasks");
      setFilterType("Search");
    } catch (error) {
      console.error("Error searching tasks:", error);
    }
  };

  // ✅ Filters
  const getFilteredTasks = () => {
    if (selectedDate) {
      return tasks.filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        const localDue = new Date(due.getTime() - due.getTimezoneOffset() * 60000);
        return localDue.toISOString().split("T")[0] === selectedDate;
      });
    }

    switch (filterType) {
      case "Completed":
        return tasks.filter((t) => t.status === "Completed");
      case "Today":
        return tasks.filter((t) => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate);
          const localDue = new Date(due.getTime() - due.getTimezoneOffset() * 60000);
          return localDue.toISOString().split("T")[0] === todayStr;
        });
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 flex flex-col md:ml-60 lg:ml-0 min-h-screen overflow-hidden relative">
       {/* ✅ Fixed Navbar */}
<div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
  <Navbar onMenuClick={toggleSidebar} onSearchChange={handleSearchChange} />
</div>

{/* ✅ Add padding-top so content doesn't hide behind navbar */}
<div className="pt-[70px]"> {/* Adjust 70px to your navbar height */}

        {/* ---------- Stats Cards ---------- */}
        <section className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div onClick={() => { setFilterType("Completed"); setSelectedDate(null); setActiveView("Tasks"); }}>
            <StatsCard title="Tasks Completed" value={completed} />
          </div>
          <div onClick={() => { setFilterType("All"); setSelectedDate(null); setActiveView("Tasks"); }}>
            <StatsCard title="Total Tasks" value={total} />
          </div>
          <div onClick={() => { setFilterType("Today"); setSelectedDate(null); setActiveView("Tasks"); }}>
            <StatsCard title="Today Tasks" value={todayTasks} />
          </div>
        </section>

        {/* ---------- Add Task Button ---------- */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveView("AddTask")}
            className="relative inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        rounded-full shadow-lg shadow-purple-300/40
                        hover:shadow-pink-400/40 hover:scale-105 hover:from-pink-500 hover:to-indigo-500
                        transition-all duration-300 ease-out active:scale-95 focus:outline-none"
          >
            <span className="text-2xl">➕</span>
            Add Task
          </button>
        </div>

        {/* ---------- Main Content ---------- */}
        <section className="p-6 pb-10 flex flex-col flex-1 overflow-hidden">
  <h2 className="text-xl font-semibold text-gray-800 mb-3">
    {activeView}{" "}
    <span className="text-sm text-gray-500">
      {selectedDate ? `(${selectedDate})` : `${filterType} Tasks`}
    </span>
  </h2>

  {activeView === "Tasks" || activeView === "Dashboard" ? (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 p-4 flex-1 max-h-[300px] overflow-y-auto">
      {loading ? (
        <div className="text-center text-gray-500 mt-10 animate-pulse">
          Loading tasks...
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateStatus={updateTaskStatus}
              deleteTask={deleteTask}
              onEdit={(selectedTask) => {
                setEditingTask(selectedTask);
                setActiveView("EditTask"); // ✅ switch view to EditTask
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No tasks found</p>
      )}
    </div>
  ) : activeView === "Recent Activity" ? (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 p-4 flex-1 max-h-[300px] overflow-y-auto">
      <ActivityFeed activities={activities} />
    </div>
  ) : activeView === "Stats" ? (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 p-6 flex-1 justify-center items-center max-h-[300px] overflow-y-auto">
      <TaskStatsOverview tasks={tasks} />
    </div>
  ) : activeView === "AddTask" ? (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 p-6 flex-1 justify-center items-center max-h-[300px] overflow-y-auto">
      <AddTask
        onAdd={addTaskToBackend}
        onCancel={() => setActiveView("Tasks")}
      />
    </div>
  ) : activeView === "EditTask" ? (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-2xl border border-gray-100 p-6 flex-1 justify-center items-center max-h-[300px] overflow-y-auto">
      <EditTask
        taskData={editingTask}
        onUpdate={updateTaskInBackend}
        onCancel={() => setActiveView("Tasks")}
      />
    </div>
  ) : null}
</section>
</div>
      </main>

      <div className="lg:static order-last lg:order-none w-full lg:w-auto">
        <RightPanel tasks={tasks} onDateClick={setSelectedDate} />
      </div>
    </div>
  );
}
