// frontend/src/components/UserProfile.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
// import Message from "./Message"; // We'll use GlobalAlert for session errors

const UserProfile = ({ onLogout, onNavigate, showAlert }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.info("UserProfile: Component mounted, fetching profile...");
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.warn("UserProfile: No token found, navigating to login.");
        // showAlert("Your session may have expired. Please login.", "warning"); // App.jsx handles this on navigation
        onNavigate("login");
        return;
      }
      try {
        const data = await api.getUserProfile(token);
        setUser(data.user);
        console.info(
          "UserProfile: Profile fetched successfully for",
          data.user?.username
        );
      } catch (error) {
        console.error(
          "UserProfile: Error fetching profile:",
          error.response || error
        );
        api.logout();
        showAlert("Session expired or invalid. Please login again.", "error");
        onNavigate("login");
      }
    };
    fetchProfile();
  }, [onNavigate, showAlert]);

  const handleLogoutClick = () => {
    console.info("UserProfile: Logout button clicked.");
    onLogout(); // This will trigger showAlert in App.jsx
  };

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <p className="text-center text-gray-700">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      {/* GlobalAlert is handled by App.jsx, no need for in-component Message here for general status */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome, {user.username}!
      </h2>
      <p className="text-center text-gray-700 mb-8">Your Email: {user.email}</p>
      <button
        onClick={handleLogoutClick}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
