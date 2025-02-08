// components/AuthForm.js
"use client";
import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


const AuthForm = ({ onAuthSuccess, setMessage }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const endpoint = mode === "login" ? "login" : "register";
    try {
      const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onAuthSuccess(data.token, data.user);
      } else {
        setMessage(data.msg || "Authentication failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mt-6">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setMode("login")}
          className={`px-4 py-2 ${
            mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-4 py-2 ${
            mode === "register" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
