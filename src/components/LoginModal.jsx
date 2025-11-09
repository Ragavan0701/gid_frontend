
import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/todoApi"; // ✅ use the configured Axios instance

export default function LoginModal({ onClose, setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "api/users/login" : "api/users/signup";
      const response = await api.post(endpoint, formData);

      console.log("Login Response:", response.data);

      const token =
        response.data?.token ||
        (typeof response.data === "string" && response.data);

      if (isLogin && token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        onClose();
      } else if (!isLogin) {
        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          text: "You can now log in.",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsLogin(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Token not received.",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error.response?.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Username already exists",
          text: "Try a different one.",
        });
      } else if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: "Please check your username or password!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Authentication Failed",
          text: "Something went wrong. Try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white text-gray-800 rounded-2xl p-8 w-96 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
