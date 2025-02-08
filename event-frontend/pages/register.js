// pages/register.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const API_URL = "https://event-management-tmhj.onrender.com/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("guest");
      router.push("/");
    } catch (err) {
      console.error("Registration error", err);
      alert("Registration failed.");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
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
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
