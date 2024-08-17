import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

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
  createProxyMiddleware({
    target: "http://threads-service:3002/api/v1/threads",
    logger: console,
  }),
);

app.use(
  "/api/v1/replies",
  createProxyMiddleware({
    target: "http://replies-service:3003/api/v1/replies",
    logger: console,
  }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
