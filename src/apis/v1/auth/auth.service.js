import SqlString from "sqlstring";
import config from "../../../config";
import { pool } from "../../../database";
import {
  APIError,
  comparePassword,
  createOTP,
  hashOTP,
  ressetPassword,
  signJSWebToken,
} from "../../../utils";
import EmailService from "../emails/email.service";

class AuthService {
  signIn({ username, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // Find username
        const sql = SqlString.format("SELECT * FROM ?? WHERE username = ?", [
          "customers",
          username,
        ]);

        const [result] = await pool.query(sql);

        if (!result.length) {
          return reject(new APIError(404, "User not found. Please sign up."));
        }

        const {
          password: passwordHash,
          customer_id,
          ...others
        } = { ...result[0] };

        // Compare password vs password db.
        const isValidPwd = await comparePassword(password, passwordHash);

        if (!isValidPwd) {
          return reject(
            new APIError(400, "Incorrect password. Please enter again.")
          );
        }

        // genarate accessToken and refreshToken
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

        // resovle accessToken and refreshToken to authController
        resovle({ accessToken, refreshToken });
      } catch (error) {
        reject(error);
      }
    });
  }

  handleForgorPassword({ username, email }) {
    return new Promise(async (resovle, reject) => {
      try {
        let sql = SqlString.format(
          "SELECT * from `customers` WHERE username=?",
          [username]
        );

        const [findCustomer] = await pool.query(sql); // [[{customer_id, ....}]]

        if (!findCustomer.length) {
          return reject(
            new APIError(404, "Username not found. Please enter again!")
          );
        }

        const { customer_id, last_name } = { ...findCustomer[0] };

        // check OTP exist with customer_id.
        sql = SqlString.format("SELECT * FROM `tokens` WHERE customer_id=?", [
          customer_id,
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

        // save hash otp to database. Table Tokens (token: hashOTP, customer_id)
        sql = SqlString.format("INSERT INTO ?? SET ?", [
          "tokens",
          { customer_id, token: _hashOTP },
        ]);

        await pool.query(sql);

        // create REDIRECT_URL: [URL_SERVER / URL_CLIENT]/api/v1/auth/change-password?customer_id=customer_id&token=otp [body: password]
        const REDIRECT_URL_CHANGE_PWD = `${config.app.serverURL}/api/v1/auth/change-password?customer_id=${customer_id}&token=${OTP}`;

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
}

export default new AuthService();
