import React from "react";
import { Clock, Activity, CheckCircle2 } from "lucide-react";

export default function ActivityFeed({ activities }) {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          Recent Activities
        </h3>
        <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Timeline List */}
      <ul className="relative border-l-2 border-blue-300 dark:border-blue-700 pl-5 space-y-5">
        {activities.length > 0 ? (
          activities.map((act, idx) => (
            <li
              key={idx}
              className="group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
            >
              {/* Timeline Dot */}
              <span className="absolute -left-[10px] w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 group-hover:bg-blue-600 transition-transform duration-300"></span>

              {/* Icon */}
              <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1 sm:mt-0 group-hover:rotate-12 transition-transform duration-300" />

              {/* Activity Text */}
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full group-hover:bg-blue-50/60 dark:group-hover:bg-gray-700/60 transition-colors duration-300">
                <p className="text-gray-700 dark:text-gray-200 text-sm font-medium leading-relaxed">
                  {act}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400 text-sm italic">
            No recent activities yet.
          </li>
        )}
      </ul>
    </div>
  );
}


