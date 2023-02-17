import config from "../../../config";
import { APIError, verifyJSWebToken } from "../../../utils";

class AuthMiddleware {
  async verifyAccessToken(req, res, next) {
    try {
      // Bearer accessToken...
      const Authorization = req.headers.authorization;

      if (!Authorization) {
        next(new APIError(401, "Please sign in again!"));
      }

      const accessToken = Authorization.split(" ")[1];

      const decode = await verifyJSWebToken({
        token: accessToken,
        privateKey: config.jwt.privateKeyAccessToken,
      });

      req.customer_id = decode.customer_id;

      next();
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new AuthMiddleware();
