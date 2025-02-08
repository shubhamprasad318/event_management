// pages/login.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const API_URL = "https://event-management-tmhj.onrender.com/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("guest");
      router.push("/");
    } catch (err) {
      console.error("Login error", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <p>Or continue as a guest</p>
            <button 
              onClick={() => {
                localStorage.setItem("guest", "true");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/");
              }}
              className="mt-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
            >
              Guest Login
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
