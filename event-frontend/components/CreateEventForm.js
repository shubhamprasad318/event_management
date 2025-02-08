// components/CreateEventForm.js
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_URL = "https://event-management-tmhj.onrender.com/api";

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    category: ""
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }
    try {
      await axios.post(`${API_URL}/events`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push("/");
    } catch (err) {
      console.error("Error creating event", err);
      alert("Error creating event");
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Event</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="e.g. Conference, Workshop, Meetup"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
