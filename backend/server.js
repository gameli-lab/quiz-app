const express = require("express");
const app = express();
const routes = require("./routes/index");
const dbClient = require("./utils/db");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// const redisclient = require('./utils/redis');

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    exposedHeaders: ["x-token"]
  })
);
app.use(express.json());
app.use(routes);
app.use(morgan("dev"));
app.use(helmet());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

dbClient.client
  .connect()
  // redisclient.client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

process.on("SIGINT", async () => {
  await dbClient.client.close();
  console.log("MongoDB disconnected");
  process.exit(0);
});
