import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));
app.use(helmet());

app.use("/", (req, res) => {
  res.send("TRANG CHU");
});

export default app;
