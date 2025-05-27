import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
console.log("VITE_API_BASE_URL from api.js:", API_URL);

const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem("userToken", response.data.token);
  }
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgotpassword`, { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await axios.put(
    `<span class="math-inline">\{API\_URL\}/resetpassword/</span>{token}`,
    { newPassword }
  );
  return response.data;
};

const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const logout = () => {
  localStorage.removeItem("userToken");
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserProfile,
  logout,
};
