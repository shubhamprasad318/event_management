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
    cors: { origin: "*" },
});

// Middleware
app.use(
  cors({
    origin: "https://your-frontend-name.vercel.app", // Vercel frontend URL
    credentials: true,
  })
);

app.use(
  cors({
    origin: "https://your-frontend-name.vercel.app", // Vercel frontend URL
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Event = mongoose.model("Event", EventSchema);

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

// Authentication Routes
app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user)
          return res.status(400).json({ msg: "User already exists" });

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

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
          return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Event Routes

// Create new event
app.post("/api/events", verifyToken, async (req, res) => {
    try {
        const { name, description, date,location } = req.body;
        const newEvent = new Event({ name, description, date, createdBy: req.user });
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

        const { name, description, date,location } = req.body;
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

        // Use deleteOne() on the document instance instead of remove()
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
        if (!query) return res.status(400).json({ msg: "Query parameter is required" });

        const events = await Event.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
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

// Get past events (events with a date less than now)
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


// WebSockets for real-time updates
io.on("connection", (socket) => {
    console.log("New WebSocket Connection:", socket.id);

    socket.on("joinEvent", (eventId) => {
        socket.join(eventId);
    });

    // Update the attendee count and emit the updated event to clients
    socket.on("attendeeUpdate", async (eventId) => {
        try {
            const updatedEvent = await Event.findByIdAndUpdate(
                eventId,
                { $inc: { attendees: 1 } },
                { new: true }
            ).populate("createdBy", "name email");

            if (updatedEvent) {
                io.to(eventId).emit("attendeeUpdated", updatedEvent);
            } else {
                console.error("No event found with ID:", eventId);
            }
        } catch (err) {
            console.error("Error updating attendee count:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
