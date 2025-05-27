// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "./api";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import UserProfile from "./components/UserProfile";
import GlobalAlert from "./components/GlobalAlert";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [resetToken, setResetToken] = useState(null);
  const [globalAlert, setGlobalAlert] = useState({ message: "", type: "" });

  const showAlert = useCallback((message, type = "success") => {
    console.log(
      `App.jsx: showAlert called - Message: "${message}", Type: "${type}"`
    );
    setGlobalAlert({ message, type });
  }, []);

  const dismissAlert = useCallback(() => {
    setGlobalAlert({ message: "", type: "" });
  }, []);

  useEffect(() => {
    console.info("App.jsx: Initializing hash change listener.");
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log("App.jsx: Hash changed or initial load. Hash:", hash);
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

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    showAlert("Login successful! Welcome back.", "success");
    setCurrentPage("profile");
    window.location.hash = "";
  };

  const handleRegisterSuccess = () => {
    showAlert("Registration successful! Please login.", "success");
    setCurrentPage("login");
    window.location.hash = "";
  };

  const handleResetSuccess = () => {
    showAlert("Password reset successfully! You can now login.", "success");
    setCurrentPage("login");
    window.location.hash = "";
  };

  const handleLogout = () => {
    api.logout(); // Removes token from localStorage via api.js
    showAlert("You have been logged out.", "info");
    setCurrentPage("login");
    window.location.hash = "";
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setResetToken(null);
    window.location.hash = page === "login" ? "" : `#/${page}`;
  };

  let content;
  switch (currentPage) {
    case "login":
      content = (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      );
      break;
    case "register":
      content = (
        <RegisterForm
          onRegisterSuccess={handleRegisterSuccess}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      );
      break;
    case "forgot-password":
      content = (
        <ForgotPasswordForm onNavigate={navigateTo} showAlert={showAlert} />
      );
      break;
    case "reset-password":
      content = resetToken ? (
        <ResetPasswordForm
          token={resetToken}
          onResetSuccess={handleResetSuccess}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      ) : (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      );
      break;
    case "profile":
      content = (
        <UserProfile
          onLogout={handleLogout}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      );
      break;
    default:
      content = (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          showAlert={showAlert}
        />
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 relative">
      <GlobalAlert
        message={globalAlert.message}
        type={globalAlert.type}
        onDismiss={dismissAlert}
      />
      {content}
    </div>
  );
}

export default App;
