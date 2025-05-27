// frontend/src/components/GlobalAlert.jsx
import React, { useEffect } from "react";

const GlobalAlert = ({ message, type, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // Auto dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) {
    return null;
  }

  let alertClasses =
    "fixed top-5 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-lg shadow-xl text-white text-sm z-50 transition-all duration-300 ease-in-out";
  let icon = "";

  switch (type) {
    case "success":
      alertClasses += " bg-green-500";
      icon = "✅ ";
      break;
    case "error":
      alertClasses += " bg-red-500";
      icon = "❌ ";
      break;
    case "info":
      alertClasses += " bg-blue-500";
      icon = "ℹ️ ";
      break;
    case "warning":
      alertClasses += " bg-yellow-500 text-gray-800";
      icon = "⚠️ ";
      break;
    default:
      alertClasses += " bg-gray-700";
  }

  return (
    <div className={alertClasses} role="alert">
      <span className="font-semibold">{icon}</span> {message}
      <button
        onClick={onDismiss}
        className="ml-4 text-xl font-semibold leading-none hover:text-gray-300 focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default GlobalAlert;
