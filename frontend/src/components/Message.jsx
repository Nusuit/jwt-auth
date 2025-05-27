// frontend/src/components/Message.jsx
import React from "react";

const Message = ({ message, type }) => {
  if (!message) return null;

  // Enhanced styling for messages
  const baseClasses = "text-center p-3 rounded-md mb-6 text-sm";
  let typeClasses = "";

  switch (type) {
    case "success":
      typeClasses = "bg-green-100 text-green-700 border border-green-300";
      break;
    case "error":
      typeClasses = "bg-red-100 text-red-700 border border-red-300";
      break;
    default: // For info or other types
      typeClasses = "bg-blue-100 text-blue-700 border border-blue-300";
  }

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default Message;
