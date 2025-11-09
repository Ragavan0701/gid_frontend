import React from "react";
import {
  CheckCircle,
  ClipboardList,
  Activity,
  Target,
  TrendingUp,
} from "lucide-react";

export default function StatsCard({ title, value }) {
  // 🎨 Dynamically decide color scheme and icon based on title
  const getStyle = () => {
    switch (title) {
      case "Tasks Completed":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          fadedIcon: (
            <CheckCircle className="absolute right-3 bottom-2 w-24 h-24 text-green-300/20" />
          ),
        };

      case "Total Tasks":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
          fadedIcon: (
            <Target className="absolute right-3 bottom-2 w-24 h-24 text-blue-300/20" />
          ),
        };

      case "Today Tasks":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <Activity className="w-8 h-8 text-yellow-600" />,
          fadedIcon: (
            <TrendingUp className="absolute right-3 bottom-2 w-24 h-24 text-yellow-300/20" />
          ),
        };

      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-300",
          icon: <Activity className="w-8 h-8 text-gray-600" />,
          fadedIcon: (
            <Activity className="absolute right-3 bottom-2 w-24 h-24 text-gray-300/20" />
          ),
        };
    }
  };

  const { color, icon, fadedIcon } = getStyle();

  return (
    <div
      className={`relative flex flex-col justify-between gap-3 p-5 sm:p-6 
        rounded-2xl shadow-md border ${color} transition-all duration-300 
        transform hover:scale-[1.03] hover:shadow-lg overflow-hidden 
        w-full min-h-[140px] sm:min-h-[160px]`}
    >
      {/* 💫 Faded Background Icon */}
      {fadedIcon}

      {/* 🔹 Header Section */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm sm:text-base md:text-lg font-semibold">
            {title}
          </span>
        </div>
      </div>

      {/* 🔸 Value Section */}
      <div className="flex flex-col items-start mt-1 z-10">
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide leading-tight">
          {value}
        </span>
      </div>

      {/* 🔻 Progress Line */}
      <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden mt-1 z-10">
        <div
          className="h-full bg-opacity-70 bg-current rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(Number(value) * 10, 100)}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
