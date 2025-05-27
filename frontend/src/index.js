import api from "./api.js";

const appDiv = document.getElementById("app");

// Hàm hiển thị thông báo
const showMessage = (elementId, message, type = "success") => {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `text-center p-2 rounded ${
      type === "success"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    } mb-4`;
    messageElement.style.display = "block";
  }
};

// Hàm ẩn thông báo
const hideMessage = (elementId) => {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.style.display = "none";
  }
};

// --- Render Login Form ---
const renderLoginForm = () => {
  appDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <div id="loginMessage" style="display: none;"></div>
        <form id="loginForm" class="space-y-4">
            <div>
                <label for="loginEmail" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="loginEmail" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
                <label for="loginPassword" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input type="password" id="loginPassword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Đăng nhập
            </button>
        </form>
        <p class="mt-4 text-center text-sm">
            Chưa có tài khoản? <a href="#" id="showRegister" class="font-medium text-indigo-600 hover:text-indigo-500">Đăng ký ngay</a>
        </p>
        <p class="mt-2 text-center text-sm">
            <a href="#" id="showForgotPassword" class="font-medium text-indigo-600 hover:text-indigo-500">Quên mật khẩu?</a>
        </p>
    `;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessage("loginMessage");
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const data = await api.login(email, password);
      showMessage("loginMessage", data.message, "success");
      // Chuyển hướng hoặc hiển thị thông tin người dùng
      renderUserProfile();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi đăng nhập.";
      showMessage("loginMessage", errorMessage, "error");
    }
  });

  document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault();
    renderRegisterForm();
  });

  document
    .getElementById("showForgotPassword")
    .addEventListener("click", (e) => {
      e.preventDefault();
      renderForgotPasswordForm();
    });
};

// --- Render Register Form ---
const renderRegisterForm = () => {
  appDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <div id="registerMessage" style="display: none;"></div>
        <form id="registerForm" class="space-y-4">
            <div>
                <label for="registerUsername" class="block text-sm font-medium text-gray-700">Tên người dùng</label>
                <input type="text" id="registerUsername" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
                <label for="registerEmail" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="registerEmail" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
                <label for="registerPassword" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input type="password" id="registerPassword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Đăng ký
            </button>
        </form>
        <p class="mt-4 text-center text-sm">
            Đã có tài khoản? <a href="#" id="showLogin" class="font-medium text-indigo-600 hover:text-indigo-500">Đăng nhập</a>
        </p>
    `;

  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessage("registerMessage");
      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      try {
        const data = await api.register(username, email, password);
        showMessage("registerMessage", data.message, "success");
        // Có thể tự động đăng nhập sau khi đăng ký thành công
        renderUserProfile();
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Lỗi đăng ký.";
        showMessage("registerMessage", errorMessage, "error");
      }
    });

  document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginForm();
  });
};

// --- Render Forgot Password Form ---
const renderForgotPasswordForm = () => {
  appDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
        <div id="forgotPasswordMessage" style="display: none;"></div>
        <form id="forgotPasswordForm" class="space-y-4">
            <div>
                <label for="forgotEmail" class="block text-sm font-medium text-gray-700">Nhập Email của bạn</label>
                <input type="email" id="forgotEmail" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Gửi liên kết đặt lại
            </button>
        </form>
        <p class="mt-4 text-center text-sm">
            <a href="#" id="backToLogin" class="font-medium text-indigo-600 hover:text-indigo-500">Quay lại Đăng nhập</a>
        </p>
    `;

  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessage("forgotPasswordMessage");
      const email = document.getElementById("forgotEmail").value;

      try {
        const data = await api.forgotPassword(email);
        showMessage("forgotPasswordMessage", data.message, "success");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Lỗi. Vui lòng thử lại.";
        showMessage("forgotPasswordMessage", errorMessage, "error");
      }
    });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginForm();
  });
};

// --- Render Reset Password Form ---
// Hàm này sẽ được gọi khi người dùng truy cập URL dạng /reset-password/:token
const renderResetPasswordForm = (token) => {
  appDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
        <div id="resetPasswordMessage" style="display: none;"></div>
        <form id="resetPasswordForm" class="space-y-4">
            <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input type="password" id="newPassword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
                <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                <input type="password" id="confirmNewPassword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Đặt lại mật khẩu
            </button>
        </form>
        <p class="mt-4 text-center text-sm">
            <a href="#" id="backToLogin" class="font-medium text-indigo-600 hover:text-indigo-500">Quay lại Đăng nhập</a>
        </p>
    `;

  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessage("resetPasswordMessage");
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      if (newPassword !== confirmNewPassword) {
        showMessage(
          "resetPasswordMessage",
          "Mật khẩu xác nhận không khớp.",
          "error"
        );
        return;
      }

      try {
        const data = await api.resetPassword(token, newPassword);
        showMessage("resetPasswordMessage", data.message, "success");
        // Sau khi reset, chuyển về trang đăng nhập
        setTimeout(() => renderLoginForm(), 3000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Lỗi đặt lại mật khẩu.";
        showMessage("resetPasswordMessage", errorMessage, "error");
      }
    });

  document.getElementById("backToLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginForm();
  });
};

// --- Render User Profile (Protected Route Example) ---
const renderUserProfile = async () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    renderLoginForm();
    return;
  }

  try {
    const data = await api.getUserProfile(token);
    appDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-center mb-6">Chào mừng, ${data.user.username}!</h2>
            <p class="text-center text-gray-700 mb-4">Email của bạn: ${data.user.email}</p>
            <button id="logoutBtn" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Đăng xuất
            </button>
        `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      api.logout();
      renderLoginForm();
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    api.logout(); // Xóa token cũ nếu không hợp lệ
    renderLoginForm(); // Chuyển về trang đăng nhập
    showMessage(
      "loginMessage",
      "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
      "error"
    );
  }
};

// --- Routing đơn giản dựa trên URL hash ---
const handleLocationHash = () => {
  const hash = window.location.hash;
  if (hash.startsWith("#/reset-password/")) {
    const token = hash.split("/")[2];
    renderResetPasswordForm(token);
  } else if (hash === "#/register") {
    renderRegisterForm();
  } else if (hash === "#/forgot-password") {
    renderForgotPasswordForm();
  } else {
    // Mặc định hiển thị trang đăng nhập hoặc profile nếu đã đăng nhập
    const token = localStorage.getItem("userToken");
    if (token) {
      renderUserProfile();
    } else {
      renderLoginForm();
    }
  }
};

// Lắng nghe sự kiện thay đổi hash
window.addEventListener("hashchange", handleLocationHash);

// Khởi tạo ứng dụng khi tải trang
document.addEventListener("DOMContentLoaded", handleLocationHash);
