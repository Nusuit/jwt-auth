// ResetPasswordForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";

const ResetPasswordForm = ({ token, onResetSuccess, onNavigate }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmNewPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      setMessageType("error");
      return;
    }

    try {
      const data = await api.resetPassword(token, newPassword);
      setMessage(data.message);
      setMessageType("success");
      setTimeout(() => onResetSuccess(), 3000); // Redirect after 3 seconds
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi đặt lại mật khẩu.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
        >
          Đặt lại mật khẩu
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <a
          href="#"
          onClick={() => onNavigate("login")}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Quay lại Đăng nhập
        </a>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
