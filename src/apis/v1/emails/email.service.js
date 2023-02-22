import config from "../../../config/index.js";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import _ from "lodash";
import { validate } from "deep-email-validator";
import APIError from "../../../utils/api-error.util.js";

class EmailService {
  static sendEmail({ email, html }) {
    return new Promise(async (resovle, reject) => {
      try {
        const CLIENT_ID = config.google.clientID;
        const CLIENT_SECRET = config.google.clientSecret;
        const REDIRECT_URI = config.google.clientRedirectURL;
        const REFRESH_TOKEN = config.google.refreshToken;

        const oAuth2Client = new google.auth.OAuth2(
          CLIENT_ID,
          CLIENT_SECRET,
          REDIRECT_URI
        );

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "ginga550505@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });

        let info = await transporter.sendMail({
          from: '"Manager Booking Hotel 👻" <ginga550505@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Quên mật khẩu ✔", // Subject line
          html: html, // html body
        });

        if (!_.isEmpty(info)) {
          resovle(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  static async validationEmail(email) {
    try {
      const response = await validate(email);

      const { valid, reason, validators } = response;

      if (!valid && reason && !validators[reason].valid) {
        return Promise.reject(
          new APIError(400, "Vui lòng cung cấp một địa chỉ email hợp lệ")
        );
      }

      return valid;
    } catch (error) {
      Promise.reject(new APIError(500, error.message));
    }
  }
}

export default EmailService;
