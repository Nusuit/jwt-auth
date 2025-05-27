// Message.jsx
import React from "react";

const Message = ({ message, type }) => {
  if (!message) return null;
  const baseClasses = "text-center p-2 rounded mb-4";
  const typeClasses =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default Message;
