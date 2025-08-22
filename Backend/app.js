const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cors = require("cors");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Import MongoDB connection
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON requests
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// Routes
app.use("/api/auth", require("./routes/authRouter"));      // Auth routes (already existing)
app.use("/api/artworks", require("./routes/artworkRoutes")); // ✅ Added Artwork routes 
app.use("/api/comments", require("./routes/commentRoutes"));


app.get("/", (req, res) => {
  res.send("Home page");
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
