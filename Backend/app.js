const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const app = express();

//Require port
const port = process.env.PORT || 3000;
// console.log("Port: ", process.env.PORT);

app.get("/", (req, res) => {
  res.send("Home page");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port} `);
});
