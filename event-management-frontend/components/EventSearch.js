// components/EventSearch.js
"use client";
import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


const EventSearch = ({ onSearchResults, onReturnHome }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/events/search?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      onSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };

  const handleUpcoming = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/upcoming`);
      const data = await res.json();
      onSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    }
  };

  const handlePast = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/past`);
      const data = await res.json();
      onSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching past events:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-8 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-1/3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition-colors"
          >
            Search
          </button>
          <button
            onClick={handleUpcoming}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded transition-colors"
          >
            Upcoming
          </button>
          <button
            onClick={handlePast}
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded transition-colors"
          >
            Past
          </button>
          <button
            onClick={onReturnHome}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSearch;
