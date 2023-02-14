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
};

export default config;
