import config from "../../../config/index.js";
import { APIError, signJSWebToken } from "../../../utils/index.js";
import { userService } from "../users/index.js";
import authService from "./auth.service.js";
import SqlString from "sqlstring";
import pool from "../../../database/init.mysql.js";

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

      const response = await authService.signIn({
        username: body.username,
        password: body.password,
      });

      // response accessToken => client and set refreshToken cookies
      if (response && response.refreshToken) {
        return res
          .cookie(
            "refreshToken",
            response.refreshToken,
            refreshTokenCookieOptions
          )
          .json({ accessToken: response.accessToken, isHome: response.isHome });
      }

      res.json({ accessToken: response.accessToken, isHome: response.isHome });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async getCurrentCustomer(req, res, next) {
    try {
      const user_id = req.user_id;

      const response = await userService.getById(user_id);

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
      const user_id = req.user_id;

      // create accessToken and refreshToken new
      const accessToken = signJSWebToken({
        privateKey: config.jwt.privateKeyAccessToken,
        data: { user: { user_id } },
        options: { expiresIn: config.jwt.expiredAccessToken },
      });

      // setCookies refreshToken and response client.
      res.json({ accessToken, message: "Get accessToken new successed." });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email, username } = req.body;

      if (!email || !username) {
        return next(new APIError(404, "Missing email, username!"));
      }

      const response = await authService.handleForgorPassword({
        email,
        username,
      });

      res.json({
        message: "Send email successed.",
        response,
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async changePassword(req, res, next) {
    try {
      const { user_id, token } = req.query;
      const { password } = req.body;

      if (!user_id || !token || !password) {
        return next(
          new APIError(404, "Missing params user_id or token or password!")
        );
      }

      const response = await authService.handleChangePassword({
        userId: user_id,
        token,
        password,
      });

      res.json({
        message: "Changed password successed.",
        response,
      });
    } catch (error) {
      next(new APIError(error.statusCode || 500, error.message));
    }
  }

  async signOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const sql = SqlString.format(
        "DELETE FROM `seesions` WHERE refresh_token=?",
        [refreshToken]
      );

      await pool.query(sql);

      res.clearCookie("refreshToken");
      res.status(200).json({
        message: "Đăng xuất thành công.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
