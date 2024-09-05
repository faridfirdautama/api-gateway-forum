import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";
import { IUserPayload } from "../entities/user.payload";

async function checkAuth(req: Request, res: Response, next: NextFunction) {
  const tokens = req.headers.cookie?.split(/[=;\s]+/);

  // check http method
  if (req.method === "POST") {
    if (tokens === undefined || tokens.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const refreshToken = tokens[tokens.indexOf("refreshToken") + 1];
    if (tokens.includes("accessToken")) {
      try {
        const accessToken = tokens[tokens.indexOf("accessToken") + 1];
        const decoded = jwt.verify(
          accessToken,
          env.JWT_ACCESS_KEY,
        ) as IUserPayload;
        next();
        return decoded;
      } catch (error) {
        if (!tokens.includes("refreshToken")) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("Error token: ", error);
        return res.status(401).json({ message: "Invalid Token" });
      }
    }
    // generate new AT
    try {
      const request = await fetch(`http://${env.HOST}:3000/api/v1/users/auth`, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await request.json();
      if (data === undefined) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      next();
      res.cookie("accessToken", data.accessToken, { httpOnly: true });
      return data;
    } catch (error) {
      console.log("Error fetching...", error);
    }
    next();
  }
  next();
}
export default checkAuth;
