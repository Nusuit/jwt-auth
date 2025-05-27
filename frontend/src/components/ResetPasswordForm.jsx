// frontend/src/components/ResetPasswordForm.jsx
import React, { useState } from "react";
import api from "../api";
import Message from "./Message";

const ResetPasswordForm = ({
  token,
  onResetSuccess,
  onNavigate,
  showAlert,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log("ResetPasswordForm: Attempting to reset password.");
    if (newPassword !== confirmNewPassword) {
      const errorMsg = "Passwords do not match.";
      showAlert(errorMsg, "error");
      // setMessage(errorMsg); setMessageType("error"); // Optional in-form
      console.error("ResetPasswordForm: Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      const errorMsg = "Password must be at least 6 characters long.";
      showAlert(errorMsg, "error");
      // setMessage(errorMsg); setMessageType("error"); // Optional in-form
      console.error("ResetPasswordForm: Password too short.");
      return;
    }

    try {
      // API response message handled by GlobalAlert via onResetSuccess
      await api.resetPassword(token, newPassword);
      // showAlert is called in App.jsx's handleResetSuccess
      onResetSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error resetting password. Please try again.";
      showAlert(errorMessage, "error");
      // setMessage(errorMessage); setMessageType("error"); // Optional in-form
      console.error(
        "ResetPasswordForm: Password reset failed",
        error.response || error
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Reset Password
      </h2>
      <Message message={message} type={messageType} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Reset Password
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

export default ResetPasswordForm;
