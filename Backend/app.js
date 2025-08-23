const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/artworks", require("./routes/artworkRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

app.get("/", (req, res) => {
  res.send("Home page");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
