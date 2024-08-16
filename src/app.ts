import express from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(
  "/api/v1/users",
  createProxyMiddleware({ target: "http://localhost:3001" }),
);

app.use(
  "/api/v1/threads",
  createProxyMiddleware({ target: "http://localhost:3002" }),
);

app.use(
  "/api/v1/replies",
  createProxyMiddleware({ target: "http://localhost:3003" }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
