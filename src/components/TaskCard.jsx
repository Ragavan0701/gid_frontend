import React, { useState } from "react";
import { CheckCircle, Circle, Clock, Trash2, Loader, Pencil } from "lucide-react";

export default function TaskCard({ task, updateStatus, deleteTask, onEdit }) {
  const [status, setStatus] = useState(task.status || "Pending");

  const handleStatusChange = (newStatus) => {
    if (newStatus === "Delete") {
      deleteTask(task.id, task.title);
    } else {
      setStatus(newStatus);
      updateStatus(task.id,task.title, newStatus);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-900 dark:bg-green-800/60 dark:text-green-100";
      case "In Progress":
        return "bg-blue-50 text-blue-900 dark:bg-blue-800/60 dark:text-blue-100";
      case "Pending":
        return "bg-yellow-50 text-yellow-900 dark:bg-yellow-800/60 dark:text-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`relative flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] w-full ${getStatusColor()}`}
    >
      <div className="flex flex-col gap-3 w-full sm:w-3/4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleStatusChange("Completed")}
            className="transition-transform duration-300 hover:scale-110"
          >
            {status === "Completed" ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <Circle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            )}
          </button>
          <span
            className={`text-base sm:text-lg font-semibold break-words ${
              status === "Completed"
                ? "line-through text-gray-600 dark:text-gray-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </span>
        </div>

        <div className="ml-8 sm:ml-12 text-sm text-gray-700 dark:text-gray-300 space-y-2">
          {task.description && (
            <p className="leading-relaxed whitespace-pre-wrap break-words pr-2">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Description:
              </span>{" "}
              {task.description}
            </p>
          )}
          <div className="flex flex-col xs:flex-row sm:flex-wrap gap-y-1 gap-x-6 text-sm">
            {task.dueDate && (
              <p className="min-w-[150px]">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Due Date:
                </span>{" "}
                {formatDate(task.dueDate)}
              </p>
            )}
            {task.createdAt && (
              <p className="min-w-[150px]">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Created:
                </span>{" "}
                {formatDate(task.createdAt)}
              </p>
            )}
            {task.priority && (
              <p className="min-w-[150px]">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Priority:
                </span>{" "}
                {task.priority}
              </p>
            )}
            {task.status && (
              <p className="min-w-[150px]">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  DB Status:
                </span>{" "}
                {task.status}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Buttons Section */}
      <div className="flex items-center justify-center sm:justify-end gap-3 flex-wrap w-full sm:w-auto">
        <button
          onClick={() => handleStatusChange("Completed")}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 shadow-md ${
            status === "Completed"
              ? "bg-green-600 text-white"
              : "text-green-600 hover:bg-green-500 hover:text-white"
          }`}
          title="Mark as Completed"
        >
          <CheckCircle className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleStatusChange("In_progress")}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 shadow-md ${
            status === "In Progress"
              ? "bg-blue-600 text-white"
              : "text-blue-600 hover:bg-blue-500 hover:text-white"
          }`}
          title="Mark as In Progress"
        >
          <Loader className="w-5 h-5 animate-spin-slow" />
        </button>

        <button
          onClick={() => handleStatusChange("Pending")}
          className={`flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 shadow-md ${
            status === "Pending"
              ? "bg-yellow-500 text-white"
              : "text-yellow-500 hover:bg-yellow-400 hover:text-white"
          }`}
          title="Mark as Pending"
        >
          <Clock className="w-5 h-5" />
        </button>

        <button
          onClick={() => onEdit(task)}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 shadow-md text-indigo-600 hover:bg-indigo-600 hover:text-white"
          title="Edit Task"
        >
          <Pencil className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleStatusChange("Delete")}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:scale-110 shadow-md text-red-600 hover:bg-red-600 hover:text-white"
          title="Delete Task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
