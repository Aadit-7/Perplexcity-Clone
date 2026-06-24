import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/data.database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const port = process.env.PORT || 8080;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectToDb().catch((err) => {
  console.log("MongoDB connection failed:", err);
  process.exit(1);
});

httpServer.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
