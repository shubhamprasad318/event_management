// components/EventList.js
import EventItem from "./EventItem";

export default function EventList({ events, refreshEvents }) {
  return (
    <div>
      {events.length === 0 ? (
        <p className="text-center">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventItem key={event._id} event={event} refreshEvents={refreshEvents} />
          ))}
        </div>
      )}
    </div>
  );
}
