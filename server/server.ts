import express from "express";
import * as bodyParser from "body-parser";
import verifyTokenMiddleware from "./middleware/authMiddleware";
import router from "./routes/index";
require("dotenv").config();

const app = express();

const PORT = process.env.SERVER_PORT;

app.use(bodyParser.json());

app.use(verifyTokenMiddleware);
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
