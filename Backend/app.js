const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen("1299", () => {
  console.log("server started");
});
