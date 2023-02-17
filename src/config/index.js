const config = {
  app: {
    port: process.env.PORT || 3000,
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
};

export default config;
