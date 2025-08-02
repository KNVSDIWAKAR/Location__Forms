const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Parser } = require("json2csv");
const app = express();

// Middleware
app.use(cors());
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
    const newEntry = new Entry(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Entry saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save entry" });
  }
});

// GET download as CSV (secret URL)
app.get("/api/download/SE@2025", async (req, res) => {
  try {
    const entries = await Entry.find({});
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
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Server is Up");
});

// For Vercel deployment
module.exports = app;
