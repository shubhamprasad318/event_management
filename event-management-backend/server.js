require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins for WebSocket connections
});

// --- Middleware ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Set frontend URL from environment variables
    credentials: true,
  })
);
app.use(express.json());

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- Models ---

// User Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Event Model
const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  date: Date,
  location: String,
  attendees: { type: Number, default: 0 },
  // List of users (IDs) who have joined the event to prevent duplicate RSVPs
  attendeesList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Event = mongoose.model("Event", EventSchema);

// --- Middleware to verify JWT ---
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ msg: "No token, authorization denied" });
  // Support both "Bearer <token>" and token-only formats
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// --- Authentication Routes ---

// Registration Route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --- Event Routes ---

// Create a new event
app.post("/api/events", verifyToken, async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    // Prevent duplicate events (by name and date)
    const existingEvent = await Event.findOne({ name, date });
    if (existingEvent)
      return res.status(400).json({ msg: "Event already exists" });

    const newEvent = new Event({ name, description, date, location, createdBy: req.user });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update an event (only by the creator)
app.put("/api/events/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user)
      return res.status(403).json({ msg: "Not authorized" });

    const { name, description, date, location } = req.body;
    event.name = name;
    event.description = description;
    event.date = date;
    event.location = location;
    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete an event (only by the creator)
app.delete("/api/events/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user)
      return res.status(403).json({ msg: "Not authorized" });

    await event.deleteOne();
    res.json({ msg: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Enhanced Feature: Search Events
app.get("/api/events/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ msg: "Query parameter is required" });

    const events = await Event.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("createdBy", "name email");

    res.json(events);
  } catch (err) {
    console.error("Error searching events:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Enhanced Feature: Upcoming Events
app.get("/api/events/upcoming", async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ date: { $gte: currentDate } })
      .sort({ date: 1 })
      .populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Past Events
app.get("/api/events/past", async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ date: { $lt: currentDate } })
      .sort({ date: -1 })
      .populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    console.error("Error fetching past events:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --- WebSockets for Real-Time Updates ---
io.on("connection", (socket) => {
  console.log("New WebSocket Connection:", socket.id);

  // Allow a socket to join a room based on the eventId
  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
  });

  // Update the attendee count and emit the updated event
  socket.on("attendeeUpdate", async ({ eventId, userId }) => {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        console.error("No event found with ID:", eventId);
        return;
      }
      // Ensure the user hasn't already joined the event
      if (!event.attendeesList.includes(userId)) {
        event.attendeesList.push(userId);
        event.attendees += 1;
        await event.save();

        const updatedEvent = await Event.findById(eventId).populate("createdBy", "name email");
        io.to(eventId).emit("attendeeUpdated", updatedEvent);
      }
    } catch (err) {
      console.error("Error updating attendee count:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
