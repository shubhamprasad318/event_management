// pages/index.js
"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Header from "../components/Header";
import AuthForm from "../components/AuthForm";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import EventSearch from "../components/EventSearch";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

let socket;

export default function Home() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  // Establish Socket.io connection when authenticated
  useEffect(() => {
    if (token) {
      socket = io(API_URL);
      socket.on("connect", () => {
        console.log("Connected to Socket.io server");
      });
      // Listen for attendee updates and update that event in state
      socket.on("attendeeUpdated", (updatedEvent) => {
        if (!updatedEvent || !updatedEvent._id) {
          console.error("Invalid update data received", updatedEvent);
          return;
        }
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev._id === updatedEvent._id ? updatedEvent : ev
          )
        );
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setMessage("");
    fetchEvents();
  };

  // On mount, check localStorage for saved authentication
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      fetchEvents();
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setEvents([]);
  };

  // Create a new event
  const handleCreateEvent = async (formData) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Event created successfully");
        fetchEvents();
      } else {
        setMessage(data.msg || "Error creating event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Error creating event");
    }
  };

  // Update an event
  const handleUpdateEvent = async (formData) => {
    if (!token || !editingEvent) return;
    try {
      const res = await fetch(`${API_URL}/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Event updated successfully");
        setEditingEvent(null);
        fetchEvents();
      } else {
        setMessage(data.msg || "Error updating event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Error updating event");
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Event deleted successfully");
        fetchEvents();
      } else {
        setMessage(data.msg || "Error deleting event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("Error deleting event");
    }
  };

  // Simulate an attendee update
  const handleSimulateAttendeeUpdate = (eventId) => {
    if (socket) {
      socket.emit("attendeeUpdate", eventId);
    }
  };

  // Join a Socket.io room for an event
  const handleJoinEvent = (eventId, eventName) => {
    if (socket) {
      socket.emit("joinEvent", eventId);
      setMessage(`Joined room for "${eventName}"`);
    }
  };

  // Handle event form submission (create or update)
  const handleEventFormSubmit = (formData) => {
    if (editingEvent) {
      handleUpdateEvent(formData);
    } else {
      handleCreateEvent(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto p-4">
        {message && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {message}
          </div>
        )}
        {!token ? (
          <AuthForm onAuthSuccess={handleAuthSuccess} setMessage={setMessage} />
        ) : (
          <>
            <EventSearch onSearchResults={setEvents} onReturnHome={fetchEvents} />
            <EventForm
              onSubmit={handleEventFormSubmit}
              editingEvent={editingEvent}
              onCancel={() => setEditingEvent(null)}
            />
            <EventList
              events={events}
              user={user}
              onEdit={(ev) => setEditingEvent(ev)}
              onDelete={handleDeleteEvent}
              onSimulateAttendeeUpdate={handleSimulateAttendeeUpdate}
              onJoinEvent={handleJoinEvent}
            />
          </>
        )}
      </main>
    </div>
  );
}
