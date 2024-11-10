const express = require("express");
const bodyBarser = require("body-parser");

const app = express();

app.use(bodyBarser.json());

app.use((error, req, res, next) => {
  // this an example of middleware
});

app.get("/", (req, res) => {
    res.send(`You are sending a request to: ${req.url}`)
});

app.listen(5001);
