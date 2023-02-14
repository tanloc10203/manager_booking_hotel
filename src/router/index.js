import { statusRouter } from "../apis/v1/statuses";

function initRouteApi(app) {
  app.use("/api/v1/statuses", statusRouter);
}

export default initRouteApi;
