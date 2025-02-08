// components/EventList.js
"use client";
import React from "react";

const EventList = ({ events, user, onEdit, onDelete, onSimulateAttendeeUpdate, onJoinEvent }) => {
  if (!Array.isArray(events)) {
    return <p className="text-center text-gray-500">No events found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div key={ev._id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-2">{ev.name}</h3>
              <p className="text-gray-700 mb-2">{ev.description}</p>
              <p className="text-gray-600 mb-2">
                Date: {new Date(ev.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">Location: {ev.location}</p>
              <p className="text-gray-600 mb-2">Attendees: {ev.attendees}</p>
              <p className="text-gray-500 mb-4">
                Created by: {ev.createdBy ? ev.createdBy.name : "N/A"}
              </p>
              <div className="flex flex-wrap gap-2">
                {user && user.id === ev.createdBy?._id && (
                  <>
                    <button
                      onClick={() => onEdit(ev)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(ev._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => onSimulateAttendeeUpdate(ev._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                >
                  +1 Attendee
                </button>
                <button
                  onClick={() => onJoinEvent(ev._id, ev.name)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded transition-colors"
                >
                  Join Room
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
