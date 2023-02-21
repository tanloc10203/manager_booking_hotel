const config = {
  app: {
    port: process.env.PORT || 3000,
    serverURL: process.env.SERVER_URL,
    clientURL: process.env.CLIENT_URL,
  },
  db: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "test",
  },
  jwt: {
    privateKeyAccessToken:
      process.env.PRIVATE_KEY_ACCESSTOKEN || "private-key1",
    privateKeyRefreshToken:
      process.env.PRIVATE_KEY_REFRESHTOKEN || "private-key2",
    expiredRefreshToken: process.env.EXPIRED_REFRESHTOKEN || "1w",
    expiredAccessToken: process.env.EXPIRED_ACCESSTOKEN || "30s",
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientRedirectURL: process.env.GOOGLE_REDIRECT_URL,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  oauth2: {
    clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
    clientRedirectURL: process.env.OAUTH2_GOOGLE_OAUTH_REDIRECT,
  },
};

export default config;
