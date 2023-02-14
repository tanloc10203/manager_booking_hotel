import app from "./src/app";
import config from "./src/config";
import DBMysql from "./src/database/init.mysql";

async function startServer() {
  try {
    DBMysql.connection();
    console.log("Connected to the database!");
    const PORT = config.app.port;

    app.listen(PORT, () => {
      console.log(`API RUNNING ON http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
