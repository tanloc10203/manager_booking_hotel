import config from "../../../config/index.js";
import { pool } from "../../../database/index.js";
import { APIError, verifyJSWebToken } from "../../../utils/index.js";
import SqlString from "sqlstring";

class AuthMiddleware {
  async verifyAccessToken(req, res, next) {
    try {
      // Bearer accessToken...
      const Authorization = req.headers.authorization;

      if (!Authorization) {
        return next(new APIError(401, "Please sign in again!"));
      }

      const accessToken = Authorization.split(" ")[1];

      const decode = await verifyJSWebToken({
        token: accessToken,
        privateKey: config.jwt.privateKeyAccessToken,
      });

      req.user_id = decode.user_id;

      next();
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async verifyRefreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new APIError(401, "Please sign in again!"));
      }

      // find Refresh Token to db
      const sql = SqlString.format("SELECT * FROM ?? WHERE refresh_token=?", [
        "seesions",
        refreshToken,
      ]);

      const [findToken] = await pool.query(sql);

      if (!findToken.length) {
        return next(new APIError(403, "jwt refreshToken expired"));
      }

      const decode = await verifyJSWebToken({
        token: refreshToken,
        privateKey: config.jwt.privateKeyRefreshToken,
      });

      req.user_id = decode.user_id;

      next();
    } catch (error) {
      if (error.message === "jwt expired") {
        // delete refresh Token db and send message client sign again.
        const refreshToken = req.cookies.refreshToken;

        const sql = SqlString.format("DELETE FROM ?? WHERE refresh_token=?", [
          "seesions",
          refreshToken,
        ]);

        await pool.query(sql);

        return next(new APIError(403, "jwt refreshToken expired"));
      }

      next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new AuthMiddleware();
