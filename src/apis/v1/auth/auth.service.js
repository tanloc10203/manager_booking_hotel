import SqlString from "sqlstring";
import config from "../../../config";
import { pool } from "../../../database";
import { APIError, comparePassword, signJSWebToken } from "../../../utils";

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
}

export default new AuthService();
