// frontend/src/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";

const ForgotPasswordForm = ({ onNavigate, showAlert }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log(
      "ForgotPasswordForm: Requesting password reset for email:",
      email
    );
    try {
      const data = await api.forgotPassword(email);
      showAlert(
        data.message || "Password reset link sent if email is registered.",
        "success"
      );
      // setMessage(data.message); // Optional: in-form message
      // setMessageType("success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error sending reset link. Please try again.";
      showAlert(errorMessage, "error");
      // setMessage(errorMessage); // Optional: in-form message
      // setMessageType("error");
      console.error(
        "ForgotPasswordForm: Failed to send reset link",
        error.response || error
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Forgot Password
      </h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="forgotEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Enter your Email Address
          </label>
          <input
            type="email"
            id="forgotEmail"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Send Reset Link
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("login");
          }}
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Back to Login
        </a>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
