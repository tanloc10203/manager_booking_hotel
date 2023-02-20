import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import initRouteApi from "./router/index.js";
import { APIError } from "./utils/index.js";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/index.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: config.app.clientURL,
    credentials: true,
  })
);
app.use(express.static(__dirname + "/assets/upload"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init router
initRouteApi(app);

// handle 404 response
app.use((req, res, next) => {
  return next(new APIError(404, "Url not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    message,
  });
});

export default app;
