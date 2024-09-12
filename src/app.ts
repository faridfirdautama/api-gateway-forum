import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import checkAuth from "./middleware/checkAuth";
import { env } from "./utils/env";
import cors from "cors";

const app = express();
app.use(cors());

app.use(
  "/api/v1/users/auth",
  createProxyMiddleware({
    target: `http://${env.HOST_USERS_SERVICE}/api/v1/users/auth`,
    logger: console,
  }),
);

app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: `http://${env.HOST_USERS_SERVICE}/api/v1/users`,
    logger: console,
  }),
);

app.use(
  "/api/v1/threads",
  checkAuth,
  createProxyMiddleware({
    target: `http://${env.HOST_THREADS_SERVICE}/api/v1/threads`,
    logger: console,
  }),
);

app.use(
  "/api/v1/replies",
  checkAuth,
  createProxyMiddleware({
    target: `http://${env.HOST_REPLIES_SERVICE}/api/v1/replies`,
    logger: console,
  }),
);

app.use(
  "/api/v1/notifications",
  createProxyMiddleware({
    target: `"http://${env.HOST_NOTIFICATIONS_SERVICE}/api/v1/notifications"`,
    logger: console,
  }),
);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
