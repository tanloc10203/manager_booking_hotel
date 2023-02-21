import {
  authRouter,
  billDetailRouter,
  billRouter,
  concernRouter,
  contractRouter,
  deviceTypeRouter,
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
  userRouter,
  useServiceRouter,
} from "../apis/v1/index.js";

function initRouteApi(app) {
  app.use("/api/v1/statuses", statusRouter);
  app.use("/api/v1/hotels", hotelRouter);
  app.use("/api/v1/concerns", concernRouter);
  app.use("/api/v1/contracts", contractRouter);
  app.use("/api/v1/registers", registerRouter);
  app.use("/api/v1/users", userRouter);
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
  app.use("/api/v1/auth", authRouter);
}

export default initRouteApi;
