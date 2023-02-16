import {
  billDetailRouter,
  billRouter,
  concernRouter,
  cooperateRouter,
  customerRouter,
  deviceTypeRouter,
  employeeRouter,
  equipmentRouter,
  floorRouter,
  hotelImageRouter,
  hotelRouter,
  registerRouter,
  roomImageRouter,
  roomPriceRouter,
  roomRouter,
  roomTypeRouter,
  serviceRouter,
  statusRouter,
  timeRouter,
  useServiceRouter,
} from "../apis/v1";

function initRouteApi(app) {
  app.use("/api/v1/statuses", statusRouter);
  app.use("/api/v1/customers", customerRouter);
  app.use("/api/v1/hotels", hotelRouter);
  app.use("/api/v1/concerns", concernRouter);
  app.use("/api/v1/cooperates", cooperateRouter);
  app.use("/api/v1/registers", registerRouter);
  app.use("/api/v1/employees", employeeRouter);
  app.use("/api/v1/services", serviceRouter);
  app.use("/api/v1/hotel-images", hotelImageRouter);
  app.use("/api/v1/device-types", deviceTypeRouter);
  app.use("/api/v1/floors", floorRouter);
  app.use("/api/v1/room-types", roomTypeRouter);
  app.use("/api/v1/times", timeRouter);
  app.use("/api/v1/room-images", roomImageRouter);
  app.use("/api/v1/rooms", roomRouter);
  app.use("/api/v1/room-prices", roomPriceRouter);
  app.use("/api/v1/equipments", equipmentRouter);
  app.use("/api/v1/bills", billRouter);
  app.use("/api/v1/bill-details", billDetailRouter);
  app.use("/api/v1/use-services", useServiceRouter);
}

export default initRouteApi;
