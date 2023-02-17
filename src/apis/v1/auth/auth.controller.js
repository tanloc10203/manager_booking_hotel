import config from "../../../config";
import { APIError, signJSWebToken } from "../../../utils";
import customerService from "../customers/customer.service";
import authService from "./auth.service";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "production" ? false : true,
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 3.154e10, // 1 year
};

class AuthController {
  async signIn(req, res, next) {
    try {
      const body = req.body;

      if (!body.username || !body.password) {
        return next(new APIError(404, "Missing username or password"));
      }

      const { accessToken, refreshToken } = await authService.signIn({
        username: body.username,
        password: body.password,
      });

      // response accessToken => client and set refreshToken cookies
      res
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .json({ accessToken });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getCurrentCustomer(req, res, next) {
    try {
      const customer_id = req.customer_id;

      const response = await customerService.getById(customer_id);

      res.json({
        data: response,
        message: "Get current customer successed.",
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const customer_id = req.customer_id;

      // create accessToken and refreshToken new
      const accessToken = signJSWebToken({
        privateKey: config.jwt.privateKeyAccessToken,
        data: { user: { customer_id } },
        options: { expiresIn: config.jwt.expiredAccessToken },
      });

      const refreshToken = signJSWebToken({
        privateKey: config.jwt.privateKeyRefreshToken,
        data: { user: { customer_id } },
        options: { expiresIn: config.jwt.expiredRefreshToken },
      });

      // setCookies refreshToken and response client.
      res
        .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        .json({ accessToken, message: "Get accessToken new successed." });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }
}

export default new AuthController();
