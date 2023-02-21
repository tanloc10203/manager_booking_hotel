import SqlString from "sqlstring";
import config from "../../../config/index.js";
import { pool } from "../../../database/index.js";
import {
  APIError,
  compareOTP,
  comparePassword,
  createOTP,
  hashOTP,
  hashPassword,
  ressetPassword,
  signJSWebToken,
} from "../../../utils/index.js";
import EmailService from "../emails/email.service.js";
import { userService } from "../users/index.js";
import axios from "axios";
import qs from "qs";

class AuthService {
  signIn({ username, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // Find username
        let sql = SqlString.format("SELECT * FROM ?? WHERE username = ?", [
          "users",
          username,
        ]);

        const [result] = await pool.query(sql);

        if (!result.length) {
          return reject(new APIError(404, "Sai tài khoản hoặc mật khẩu."));
        }

        const {
          password: passwordHash,
          user_id,
          is_admin,
          ...others
        } = { ...result[0] };

        // Compare password vs password db.
        const isValidPwd = await comparePassword(password, passwordHash);

        if (!isValidPwd) {
          return reject(
            new APIError(400, "Mật khẩu không đúng. Vui lòng nhập lại.")
          );
        }

        // genarate accessToken and refreshToken
        const accessToken = signJSWebToken({
          privateKey: config.jwt.privateKeyAccessToken,
          data: { user: { user_id } },
          options: { expiresIn: config.jwt.expiredAccessToken },
        });

        const refreshToken = await this.handleRefreshToken(user_id);

        // resovle accessToken and refreshToken to authController
        return resovle({ accessToken, refreshToken, isHome: !is_admin });
      } catch (error) {
        reject(error);
      }
    });
  }

  handleForgorPassword({ username, email }) {
    return new Promise(async (resovle, reject) => {
      try {
        let sql = SqlString.format("SELECT * from `users` WHERE username=?", [
          username,
        ]);

        const [findCustomer] = await pool.query(sql); // [[{user_id, ....}]]

        if (!findCustomer.length) {
          return reject(
            new APIError(404, "Username not found. Please enter again!")
          );
        }

        const { user_id, last_name } = { ...findCustomer[0] };

        // check OTP exist with user_id.
        sql = SqlString.format("SELECT * FROM `tokens` WHERE user_id=?", [
          user_id,
        ]);

        const [findOTP] = await pool.query(sql);

        if (findOTP.length > 0) {
          return reject(
            new APIError(400, "OTP was exist. Please check e-mail.")
          );
        }

        // create token: use lib => otp (6 character) => hash otp
        const OTP = createOTP();
        const _hashOTP = await hashOTP(OTP);

        // save hash otp to database. Table Tokens (token: hashOTP, user_id)
        sql = SqlString.format("INSERT INTO ?? SET ?", [
          "tokens",
          { user_id, token: _hashOTP },
        ]);

        await pool.query(sql);

        // create REDIRECT_URL: [URL_SERVER / URL_CLIENT]/api/v1/auth/change-password?user_id=user_id&token=otp [body: password]
        const REDIRECT_URL_CHANGE_PWD = `${config.app.serverURL}/api/v1/auth/change-password?user_id=${user_id}&token=${OTP}`;

        // send email
        const send = await EmailService.sendEmail({
          email,
          html: ressetPassword({
            lastName: last_name,
            REDIRECT_URL: REDIRECT_URL_CHANGE_PWD,
          }),
        });

        if (send) {
          resovle(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  handleChangePassword({ userId, token, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // find Token
        let sql = SqlString.format("SELECT * FROM `tokens` WHERE user_id=?", [
          userId,
        ]);

        const [findToken] = await pool.query(sql);

        if (!findToken.length) {
          return reject(new APIError(404, "Token not found!"));
        }

        const { token: hash } = { ...findToken[0] };

        // check isValidToken
        const isValidToken = await compareOTP(token, hash);

        if (!isValidToken) {
          return reject(new APIError(400, "Token was not valid!"));
        }

        // hash password
        const _hashPassword = await hashPassword(password);

        // update password to table `customers`
        const response = await userService.update(userId, {
          password: _hashPassword,
        });

        sql = SqlString.format("DELETE FROM `tokens` WHERE user_id=?", [
          userId,
        ]);

        await pool.query(sql);

        resovle(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  getGoogleOAuthTokens({ code }) {
    return new Promise(async (resolve, reject) => {
      const url = "https://oauth2.googleapis.com/token";

      const values = {
        code,
        client_id: config.oauth2.clientID,
        client_secret: config.oauth2.clientSecret,
        redirect_uri: config.oauth2.clientRedirectURL,
        grant_type: "authorization_code",
      };

      try {
        const response = await axios.post(url, qs.stringify(values), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getGoogleUser({ id_token, access_token }) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        );

        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  async handleRefreshToken(userId) {
    try {
      let sql = SqlString.format("SELECT * FROM ?? WHERE user_id=?", [
        "seesions",
        userId,
      ]);

      const [findToken] = await pool.query(sql);

      let refreshToken = "";

      if (!findToken.length) {
        refreshToken = signJSWebToken({
          privateKey: config.jwt.privateKeyRefreshToken,
          data: { user: { user_id: userId } },
          options: { expiresIn: config.jwt.expiredRefreshToken },
        });

        sql = SqlString.format("INSERT INTO ?? SET ?", [
          "seesions",
          { user_id: userId, refresh_token: refreshToken },
        ]);

        await pool.query(sql);
      } else {
        refreshToken = findToken[0].refresh_token;
      }

      return refreshToken;
    } catch (error) {
      Promise.reject(error);
    }
  }

  handleUserSignInWithGoogle(user) {
    return new Promise(async (resolve, reject) => {
      try {
        let sql = SqlString.format("SELECT * FROM ?? where ??=?", [
          "users",
          "email",
          user.email,
        ]);

        const [findUser] = await pool.query(sql);
        let id = -1;
        let refreshToken = "";

        // * Create user
        if (!findUser.length) {
          sql = SqlString.format("INSERT INTO ?? SET ?", [
            "users",
            {
              email: user.email,
              first_name: user.family_name,
              last_name: user.given_name,
              picture: user.picture,
            },
          ]);

          const [result] = await pool.query(sql);

          id = result.insertId;
        } else {
          // * update user
          await userService.update(findUser[0].user_id, {
            email: user.email,
            first_name: user.family_name,
            last_name: user.given_name,
            picture: user.picture,
          });

          id = findUser[0].user_id;
        }

        if (id !== -1) {
          refreshToken = await this.handleRefreshToken(id);
        }

        resolve({ refreshToken });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new AuthService();
