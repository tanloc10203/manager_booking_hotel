import SqlString from "sqlstring";
import config from "../../../config";
import { pool } from "../../../database";
import {
  APIError,
  compareOTP,
  comparePassword,
  createOTP,
  hashOTP,
  hashPassword,
  ressetPassword,
  signJSWebToken,
} from "../../../utils";
import customerService from "../customers/customer.service";
import EmailService from "../emails/email.service";

class AuthService {
  signIn({ username, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // Find username
        let sql = SqlString.format("SELECT * FROM ?? WHERE username = ?", [
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

        sql = SqlString.format("SELECT * FROM ?? WHERE customer_id=?", [
          "seesions",
          customer_id,
        ]);

        const [findToken] = await pool.query(sql);

        if (!findToken.length) {
          const refreshToken = signJSWebToken({
            privateKey: config.jwt.privateKeyRefreshToken,
            data: { user: { customer_id } },
            options: { expiresIn: config.jwt.expiredRefreshToken },
          });

          sql = SqlString.format("INSERT INTO ?? SET ?", [
            "seesions",
            { customer_id, refresh_token: refreshToken },
          ]);

          await pool.query(sql);

          return resovle({ accessToken, refreshToken });
        }

        // resovle accessToken and refreshToken to authController
        resovle({ accessToken });
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

  handleChangePassword({ customerId, token, password }) {
    return new Promise(async (resovle, reject) => {
      try {
        // find Token
        let sql = SqlString.format(
          "SELECT * FROM `tokens` WHERE customer_Id=?",
          [customerId]
        );

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
        const response = await customerService.update(customerId, {
          password: _hashPassword,
        });

        resovle(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new AuthService();
