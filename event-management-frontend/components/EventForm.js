// components/EventForm.js
"use client";
import React, { useState, useEffect } from "react";

const EventForm = ({ onSubmit, editingEvent, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "", // new field for location
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        description: editingEvent.description,
        date: editingEvent.date ? editingEvent.date.substring(0, 10) : "",
        location: editingEvent.location || "", // pre-fill location if available
      });
    } else {
      setFormData({ name: "", description: "", date: "", location: "" });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingEvent) {
      setFormData({ name: "", description: "", date: "", location: "" });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 my-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editingEvent ? "Edit Event" : "Create New Event"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Event Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* New: Location */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded transition-colors"
          >
            {editingEvent ? "Update Event" : "Create Event"}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventForm;
