// frontend/src/components/RegisterForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";

const RegisterForm = ({ onRegisterSuccess, onNavigate, showAlert }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For in-form specific messages
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("RegisterForm: Attempting registration for:", {
      username,
      email,
    });
    try {
      // API response message handled by GlobalAlert via onRegisterSuccess
      await api.register(username, email, password);
      // showAlert is called in App.jsx's handleRegisterSuccess
      onRegisterSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      showAlert(errorMessage, "error");
      // setMessage(errorMessage); // Optional: if you want in-form message too
      // setMessageType("error");
      console.error(
        "RegisterForm: Registration failed",
        error.response || error
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create Account
      </h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="registerUsername"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="registerUsername"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="yourusername"
          />
        </div>
        <div>
          <label
            htmlFor="registerEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="registerEmail"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="registerPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="registerPassword"
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
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("login");
          }}
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
