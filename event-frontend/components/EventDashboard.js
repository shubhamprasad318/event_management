// components/EventDashboard.js
import { useState, useEffect } from "react";
import axios from "axios";
import EventList from "./EventList";

const API_URL = "https://event-management-tmhj.onrender.com/api";

export default function EventDashboard() {
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState("all"); // Options: all, upcoming, past
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events by date and category
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const now = new Date();
    let dateMatch = true;
    if (filterType === "upcoming") {
      dateMatch = eventDate >= now;
    } else if (filterType === "past") {
      dateMatch = eventDate < now;
    }

    let categoryMatch = true;
    // If event.category is not defined, assume "Uncategorized"
    const eventCategory = event.category || "Uncategorized";
    if (categoryFilter !== "all") {
      categoryMatch = eventCategory.toLowerCase() === categoryFilter.toLowerCase();
    }
    return dateMatch && categoryMatch;
  });

  // Create a list of unique categories for filtering
  const categories = Array.from(
    new Set(events.map((event) => event.category || "Uncategorized"))
  );

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Event Dashboard</h2>
      <div className="flex flex-col md:flex-row justify-center items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <div>
          <label className="mr-2 font-medium">Date Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <EventList events={filteredEvents} refreshEvents={fetchEvents} />
    </div>
  );
}
