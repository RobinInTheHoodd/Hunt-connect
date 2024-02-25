import express from "express";
import * as bodyParser from "body-parser";
import verifyTokenMiddleware from "./middleware/authMiddleware";
import router from "./routes/index";
import errorPostgresMiddleware from "./middleware/errorPostgresMiddleware";
import errorFirebaseMiddleware from "./middleware/errorFirebaseMiddleware";

require("dotenv").config();

const app = express();

const PORT = process.env.SERVER_PORT;

app.use(bodyParser.json());

app.use(verifyTokenMiddleware);

app.use(router);

app.use(errorPostgresMiddleware);
app.use(errorFirebaseMiddleware);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
