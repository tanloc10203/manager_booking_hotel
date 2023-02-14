import "dotenv/config";
import app from "./src/app";
import config from "./src/config";
import { DBMysql } from "./src/database";

function startServer() {
  try {
    DBMysql.connection().connect((error) => {
      if (error) console.log("Cannot connect to the database!", error);
    });
    console.log("Connected to the database!");
    const PORT = config.app.port;

    app.listen(PORT, () => {
      console.log(`API RUNNING ON http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("API exit!", error);
    process.exit();
  }
}

startServer();
