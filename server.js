import "dotenv/config";
import app from "./src/app";
import config from "./src/config";

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`API RUNNING ON http://localhost:${PORT}`);
});
