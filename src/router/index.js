import {
  cooperateRouter,
  customerRouter,
  hotelRouter,
  statusRouter,
  concernRouter,
  registerRouter,
  employeeRouter,
} from "../apis/v1";

function initRouteApi(app) {
  app.use("/api/v1/statuses", statusRouter);
  app.use("/api/v1/customers", customerRouter);
  app.use("/api/v1/hotels", hotelRouter);
  app.use("/api/v1/concerns", concernRouter);
  app.use("/api/v1/cooperates", cooperateRouter);
  app.use("/api/v1/registers", registerRouter);
  app.use("/api/v1/employees", employeeRouter);
}

export default initRouteApi;
