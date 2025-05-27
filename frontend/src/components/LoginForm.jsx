// LoginForm.jsx
import React, { useState } from "react";
import api from "../api"; // Đường dẫn tương đối từ components
import Message from "./Message";

const LoginForm = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    try {
      const data = await api.login(email, password);
      setMessage(data.message);
      setMessageType("success");
      onLoginSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi đăng nhập.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="loginEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="loginEmail"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="loginPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </label>
          <input
            type="password"
            id="loginPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
        >
          Đăng nhập
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Chưa có tài khoản?{" "}
        <a
          href="#"
          onClick={() => onNavigate("register")}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Đăng ký ngay
        </a>
      </p>
      <p className="mt-2 text-center text-sm">
        <a
          href="#"
          onClick={() => onNavigate("forgot-password")}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Quên mật khẩu?
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
