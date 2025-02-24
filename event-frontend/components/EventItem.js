// components/EventItem.js
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Link from "next/link";

// Connect to the backend WebSocket server
const socket = io("https://event-management-tmhj.onrender.com");

export default function EventItem({ event, refreshEvents }) {
  const [attendees, setAttendees] = useState(event.attendees);

  useEffect(() => {
    socket.emit("joinEvent", event._id);
    socket.on("attendeeUpdated", (updatedEvent) => {
      if (updatedEvent._id === event._id) {
        setAttendees(updatedEvent.attendees);
        if (refreshEvents) refreshEvents();
      }
    });

    return () => {
      socket.off("attendeeUpdated");
    };
  }, [event._id, refreshEvents]);

  const handleJoin = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const guest = localStorage.getItem("guest");
    if (guest) {
      alert("Guest users cannot join events. Please register or login.");
      return;
    }
    if (!user) {
      alert("Please login to join the event.");
      return;
    }
    socket.emit("attendeeUpdate", { eventId: event._id, userId: user.id });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
      <p className="mb-2">{event.description}</p>
      <p className="mb-2">
        <span className="font-semibold">Date:</span>{" "}
        {new Date(event.date).toLocaleString()}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Location:</span> {event.location}
      </p>
      {event.category && (
        <p className="mb-2">
          <span className="font-semibold">Category:</span> {event.category}
        </p>
      )}
      <p className="mb-2">
        <span className="font-semibold">Attendees:</span> {attendees}
      </p>
      
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleJoin}
          className="flex-1 mr-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Join Event
        </button>
        <Link href={`/edit-event/${event._id}`}>
          <a className="flex-1 ml-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-md shadow hover:from-yellow-500 hover:to-yellow-600 transition duration-200 text-center">
            Edit
          </a>
        </Link>
      </div>
    </div>
  );
}
