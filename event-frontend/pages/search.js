// pages/search.js
import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return; // Skip if query is empty
    setLoading(true);
    try {
      const response = await axios.get(
        `https://event-management-tmhj.onrender.com/api/events/search?query=${encodeURIComponent(query)}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error searching events:", error);
      alert("Error searching events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Search Events</h1>
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter event name or description..."
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div>
          {results.length === 0 && !loading ? (
            <p className="text-center text-gray-600">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((event) => (
                <div key={event._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h2 className="text-2xl font-semibold mb-2">{event.name}</h2>
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <p className="text-gray-500">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-gray-500">{event.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
