// pages/edit-event/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const EditEventPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the event ID from the URL

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    category: ""
  });
  const [loading, setLoading] = useState(false);

  // Fetch the event details when the component mounts
  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        // Assuming your /api/events endpoint returns all events
        // You could also add a dedicated GET /api/events/:id endpoint on your backend
        const res = await axios.get("https://event-management-tmhj.onrender.com/api/events");
        const event = res.data.find((ev) => ev._id === id);
        if (event) {
          setFormData({
            name: event.name,
            description: event.description,
            date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
            location: event.location,
            category: event.category || ""
          });
        } else {
          alert("Event not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        alert("Error fetching event details");
      }
    };
    fetchEvent();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update the event
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update an event.");
      return;
    }
    try {
      await axios.put(
        `https://event-management-tmhj.onrender.com/api/events/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Event updated successfully");
      router.push("/");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event");
    } finally {
      setLoading(false);
    }
  };

  // Delete the event
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete an event.");
      return;
    }
    try {
      await axios.delete(`https://event-management-tmhj.onrender.com/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Event</h1>
        <form onSubmit={handleUpdate} className="max-w-lg mx-auto bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700">Event Name</label>
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
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date & Time</label>
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
            <label className="block text-gray-700">Location</label>
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
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Optional"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </form>
        <div className="max-w-lg mx-auto mt-4">
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
          >
            Delete Event
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EditEventPage;
