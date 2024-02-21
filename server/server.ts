import express from "express";
import * as bodyParser from "body-parser";
import router from "./routes/index";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
