// ForgotPasswordForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";

const ForgotPasswordForm = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await api.forgotPassword(email);
      setMessage(data.message);
      setMessageType("success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Lỗi. Vui lòng thử lại.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="forgotEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Nhập Email của bạn
          </label>
          <input
            type="email"
            id="forgotEmail"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
        >
          Gửi liên kết đặt lại
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

export default ForgotPasswordForm;
