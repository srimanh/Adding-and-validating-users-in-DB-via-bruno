// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
const port = 3010;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/marketplaceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Mongoose Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Register Endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if fields are not empty
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Marketplace!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
