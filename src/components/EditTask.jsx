import React, { useState, useEffect } from "react";
import { CalendarDays, ClipboardEdit } from "lucide-react";

export default function EditTask({ taskData, onUpdate, onCancel }) {
  const [task, setTask] = useState({
    id: null,
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
  });

  // ✅ Prefill task details
  useEffect(() => {
    if (taskData) {
      const formattedDate = taskData.dueDate
        ? new Date(taskData.dueDate).toISOString().split("T")[0]
        : "";
      setTask({
        id: taskData.id,
        title: taskData.title || "",
        description: taskData.description || "",
        dueDate: formattedDate,
        priority: taskData.priority || "Medium",
        status: taskData.status || "Pending",
      });
    }
  }, [taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim() || !task.dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    // 🕒 Add end-of-day time for due date consistency
    const formattedDueDate = `${task.dueDate}T23:59:59`;
    const updatedTask = { ...task, dueDate: formattedDueDate };

    try {
      await onUpdate(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancel = () => {
    setTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "",
      status: "",
    });
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 border border-gray-200 hover:shadow-blue-200 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <ClipboardEdit className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Edit Task
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-300 placeholder-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              rows="3"
              placeholder="Write task details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:bg-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all duration-300 resize-none placeholder-gray-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-white/60 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-300">
              <CalendarDays className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full py-3 bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>



         

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

