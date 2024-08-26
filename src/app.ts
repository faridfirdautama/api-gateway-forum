import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import checkAuth from "./middleware/checkAuth";

const app = express();
dotenv.config();

app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: "http://users-service:3001/api/v1/users",
    logger: console,
  }),
);

app.use(
  "/api/v1/threads",
  checkAuth,
  createProxyMiddleware({
    target: "http://threads-service:3002/api/v1/threads",
    logger: console,
  }),
);

app.use(
  "/api/v1/replies",
  checkAuth,
  createProxyMiddleware({
    target: "http://replies-service:3003/api/v1/replies",
    logger: console,
  }),
);

app.use(
  "/api/v1/notifications",
  createProxyMiddleware({
    target: "http://notifications-service:3004/api/v1/notifications",
    logger: console,
  }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
