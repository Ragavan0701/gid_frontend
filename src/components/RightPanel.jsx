import React, { useState } from "react";
import {
  Calendar,
  ListTodo,
  Clock,
  Bell,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RightPanel({ tasks, onDateClick }) {
  const quickItems = [
    { icon: <Clock className="w-5 h-5 text-blue-500" />, label: "Focus" },
    { icon: <Bell className="w-5 h-5 text-yellow-500" />, label: "Reminders" },
    { icon: <ListTodo className="w-5 h-5 text-green-500" />, label: "New Task" },
    { icon: <Calendar className="w-5 h-5 text-purple-500" />, label: "Events" },
    { icon: <MessageSquare className="w-5 h-5 text-pink-500" />, label: "Messages" },
  ];

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  // 🟡 Collect due dates from tasks
  const taskDates = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const dateKey = localDate.toISOString().split("T")[0];
      if (!taskDates[dateKey]) taskDates[dateKey] = [];
      taskDates[dateKey].push(task);
    }
  });

  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div
      className="
        w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 
        p-4 md:p-6 flex flex-col gap-6 
        sticky top-[4.5rem] lg:h-screen overflow-y-auto
      "
    >
      {/* ===== Calendar Section ===== */}
      <div className="relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Calendar className="w-5 h-5 text-blue-500" />
            {monthName} {year}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${month}-${year}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-7 gap-1 text-sm"
          >
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />;

              const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                day
              ).padStart(2, "0")}`;
              const dayTasks = taskDates[dateKey] || [];

              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onDateClick(dateKey)} // 🆕 Show tasks for that date
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg
                    border transition-all duration-300 relative
                    ${
                      isToday
                        ? "bg-blue-600 text-white font-semibold shadow-md border-blue-600"
                        : "bg-gray-50 hover:bg-blue-100 border-gray-200 cursor-pointer"
                    }
                  `}
                >
                  {day}

                  {/* Dots for tasks */}
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayTasks.slice(0, 3).map((_, idx) => (
                      <span
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full bg-green-500"
                      ></span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ===== Quick Access Section ===== */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
          <ListTodo className="w-5 h-5 text-green-500" />
          Quick Access
        </h3>

        <div
          className="
            flex lg:flex-col overflow-x-auto lg:overflow-visible
            gap-3 pb-2 scrollbar-hide
          "
        >
          {quickItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="
                min-w-[90px] sm:min-w-[100px] bg-gradient-to-r from-gray-100 to-gray-50 
                rounded-xl flex flex-col items-center p-3 
                hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transition cursor-pointer
                lg:w-full lg:flex-row lg:justify-start lg:gap-3
              "
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.icon}
              </div>
              <p className="text-xs lg:text-sm mt-1 lg:mt-0 font-medium text-center lg:text-left text-gray-700">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
