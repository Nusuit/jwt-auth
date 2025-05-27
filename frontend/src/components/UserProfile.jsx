// UserProfile.jsx
import React, { useState, useEffect } from "react";
import api from "../api";
import Message from "./Message";

const UserProfile = ({ onLogout, onNavigate }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        onNavigate("login");
        return;
      }
      try {
        const data = await api.getUserProfile(token);
        setUser(data.user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        api.logout(); // Clear invalid token
        onNavigate("login"); // Redirect to login
        setMessage(
          "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
        );
        setMessageType("error");
      }
    };
    fetchProfile();
  }, [onNavigate]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <Message message={message} type={messageType} />
      {user ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">
            Chào mừng, {user.username}!
          </h2>
          <p className="text-center text-gray-700 mb-4">
            Email của bạn: {user.email}
          </p>
          <button
            onClick={onLogout}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <p className="text-center text-gray-700">
          Đang tải thông tin người dùng...
        </p>
      )}
    </div>
  );
};

export default UserProfile;
