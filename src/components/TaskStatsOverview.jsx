import React, { useMemo } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";

export default function TaskStatsOverview({ tasks }) {
  const total = tasks.length;

  // ✅ Derived stats using current date
  const today = new Date();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const overdue = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < today && t.status !== "Completed"
    ).length;
    const upcoming = tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) > today
    ).length;

    const calcPercent = (val) => (total ? Math.round((val / total) * 100) : 0);

    return {
      completed,
      pending,
      inProgress,
      overdue,
      upcoming,
      completionRate: calcPercent(completed),
      calcPercent,
    };
  }, [tasks, total]);

  const overviewStats = [
    {
      label: "Completed Tasks",
      value: stats.completed,
      percent: stats.calcPercent(stats.completed),
      color: "#16a34a",
      icon: <CheckCircle2 className="w-7 h-7 text-green-500" />,
      bg: "from-green-50 to-emerald-100",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      percent: stats.calcPercent(stats.inProgress),
      color: "#f59e0b",
      icon: <Clock className="w-7 h-7 text-yellow-500" />,
      bg: "from-amber-50 to-yellow-100",
    },
    {
      label: "Pending Tasks",
      value: stats.pending,
      percent: stats.calcPercent(stats.pending),
      color: "#3b82f6",
      icon: <Clock className="w-7 h-7 text-blue-500" />,
      bg: "from-blue-50 to-indigo-100",
    },
  ];

  const dueStats = [
    {
      label: "Overdue Tasks",
      value: stats.overdue,
      percent: stats.calcPercent(stats.overdue),
      color: "#ef4444",
      icon: <AlertTriangle className="w-7 h-7 text-red-500" />,
      bg: "from-red-50 to-rose-100",
    },
    {
      label: "Upcoming Deadlines",
      value: stats.upcoming,
      percent: stats.calcPercent(stats.upcoming),
      color: "#2563eb",
      icon: <CalendarClock className="w-7 h-7 text-blue-600" />,
      bg: "from-indigo-50 to-blue-100",
    },
    {
      label: "Avg. Completion Rate",
      value: `${stats.completionRate}%`,
      percent: stats.completionRate,
      color: "#7c3aed",
      icon: <TrendingUp className="w-7 h-7 text-purple-600" />,
      bg: "from-violet-50 to-purple-100",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-6xl mx-auto animate-fade-in">
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center tracking-wide">
        📊 Task Analytics Overview
      </h3>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {overviewStats.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            className={`bg-gradient-to-br ${item.bg} shadow-md hover:shadow-xl hover:scale-105 transition-all rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center border border-gray-100`}
          >
            <div className="mb-3">{item.icon}</div>
            <div className="w-20 sm:w-24 h-20 sm:h-24 mb-3">
              <CircularProgressbar
                value={item.percent}
                text={`${item.percent}%`}
                styles={buildStyles({
                  textColor: item.color,
                  pathColor: item.color,
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
              {item.label}
            </h4>
            <p className="text-gray-500 text-sm">
              {item.value} / {total} tasks
            </p>
          </motion.div>
        ))}
      </div>

      {/* Deadline Stats */}
      <h4 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center">
        ⏰ Deadline Insights
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {dueStats.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={`bg-gradient-to-br ${item.bg} shadow-md hover:shadow-xl hover:scale-105 transition-all rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center border border-gray-100`}
          >
            <div className="mb-3">{item.icon}</div>
            <div className="w-20 sm:w-24 h-20 sm:h-24 mb-3">
              <CircularProgressbar
                value={item.percent}
                text={`${item.percent}%`}
                styles={buildStyles({
                  textColor: item.color,
                  pathColor: item.color,
                  trailColor: "#f3f4f6",
                })}
              />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
              {item.label}
            </h4>
            <p className="text-gray-500 text-sm text-center">
              {typeof item.value === "string"
                ? item.value
                : `${item.value} / ${total} tasks`}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
