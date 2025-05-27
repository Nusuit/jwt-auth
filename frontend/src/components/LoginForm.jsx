// frontend/src/components/LoginForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message"; // For in-form specific messages if needed

const LoginForm = ({ onLoginSuccess, onNavigate, showAlert }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For in-form error messages
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("LoginForm: Attempting login with email:", email);
    try {
      // API response message will be handled by GlobalAlert via onLoginSuccess
      await api.login(email, password);
      // showAlert is called in App.jsx's handleLoginSuccess
      onLoginSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      // Show error in form OR globally, choose one or combine.
      // For now, let's use the global alert for major errors.
      showAlert(errorMessage, "error");
      // If you also want an in-form message:
      // setMessage(errorMessage);
      // setMessageType("error");
      console.error("LoginForm: Login failed", error.response || error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Login
      </h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="loginEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="loginEmail"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="loginPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="loginPassword"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("register");
          }}
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Sign up
        </a>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("forgot-password");
          }}
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Forgot password?
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
