const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Parser } = require("json2csv");
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb+srv://divvukancherla630:12345@cluster0.ndvsjgf.mongodb.net")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Entry schema and model
const entrySchema = new mongoose.Schema({
  danushId: String,
  wdCode: String,
  raType: String,
  payout: Number,
  grantLocation: String,
  latitude: Number,
  longitude: Number,
});
const Entry = mongoose.model("Entry", entrySchema);

// POST new entry
app.post("/api/entries", async (req, res) => {
  try {
    console.log("Received request:", req.body); // 👈 add this
    const newEntry = new Entry(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Entry saved" });
  } catch (err) {
    console.error("Error saving entry:", err); // 👈 log full error
    res.status(500).json({ error: "Failed to save entry" });
  }
});

// GET download as CSV (secret URL)
app.get("/api/download/SE@2025", async (req, res) => {
  try {
    const entries = await Entry.find({});
    console.log("Entries fetched:", entries.length);

    if (!entries || entries.length === 0) {
      return res.status(404).json({ error: "No entries to export" });
    }

    const fields = [
      "danushId",
      "wdCode",
      "raType",
      "payout",
      "grantLocation",
      "latitude",
      "longitude",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(entries);

    res.header("Content-Type", "text/csv");
    res.attachment("entries.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV generation error:", err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is Up");
});

// For Vercel deployment
module.exports = app;
