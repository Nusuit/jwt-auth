// App.jsx
import React, { useState, useEffect } from "react";
import api from "./api";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import UserProfile from "./components/UserProfile";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // Default page
  const [resetToken, setResetToken] = useState(null);

  // Simple routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/reset-password/")) {
        const token = hash.split("/")[2];
        setResetToken(token);
        setCurrentPage("reset-password");
      } else if (hash === "#/register") {
        setCurrentPage("register");
      } else if (hash === "#/forgot-password") {
        setCurrentPage("forgot-password");
      } else if (localStorage.getItem("userToken")) {
        setCurrentPage("profile");
      } else {
        setCurrentPage("login");
      }
    };

    // Initial check on component mount
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLoginSuccess = () => {
    setCurrentPage("profile");
    window.location.hash = ""; // Clear hash
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("profile");
    window.location.hash = ""; // Clear hash
  };

  const handleResetSuccess = () => {
    setCurrentPage("login");
    window.location.hash = ""; // Clear hash
  };

  const handleLogout = () => {
    api.logout();
    setCurrentPage("login");
    window.location.hash = ""; // Clear hash
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setResetToken(null); // Clear token if navigating away from reset-password
    window.location.hash = page === "login" ? "" : `#/${page}`;
  };

  let content;
  switch (currentPage) {
    case "login":
      content = (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      );
      break;
    case "register":
      content = (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onNavigate={navigateTo}
        />
      );
      break;
    case "forgot-password":
      content = <ForgotPasswordForm onNavigate={navigateTo} />;
      break;
    case "reset-password":
      // Only render ResetPasswordForm if a token is present
      content = resetToken ? (
        <ResetPasswordForm
          token={resetToken}
          onResetSuccess={handleResetSuccess}
          onNavigate={navigateTo}
        />
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      );
      break;
    case "profile":
      content = <UserProfile onLogout={handleLogout} onNavigate={navigateTo} />;
      break;
    default:
      content = (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
        />
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {content}
    </div>
  );
}

export default App;
