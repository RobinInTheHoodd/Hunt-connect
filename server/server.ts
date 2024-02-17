import express from "express";
import * as bodyParser from "body-parser";
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/test", (req, res) => {
  res.send("Bonjour depuis le serveur!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
