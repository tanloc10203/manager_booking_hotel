import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import initRouteApi from "./router";
import { APIError } from "./utils";

const app = express();

app.use(morgan("combined"));
app.use(helmet());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

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
    errors: {
      message,
    },
  });
});

export default app;
