import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/env";
import { IUserPayload } from "../entities/user.payload";

async function checkAuth(req: Request, res: Response, next: NextFunction) {
  const tokens = req.headers.cookie?.split(/[=;\s]+/);

  if (req.method === "POST") {
    if (tokens === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = tokens[tokens.indexOf("accessToken") + 1];
    const refreshToken = tokens[tokens.indexOf("refreshToken") + 1];

    // Check Token's presence
    if (accessToken) {
      try {
        // Verify accessToken
        const decoded = jwt.verify(
          accessToken,
          env.JWT_ACCESS_KEY as string,
        ) as IUserPayload;
        next();
        return decoded;
      } catch (error) {
        // REFRESH_TOKEN
        if (refreshToken) {
          try {
            // Check RT on userService DB
            const decoded = jwt.verify(
              refreshToken,
              env.JWT_REFRESH_KEY as string,
            ) as IUserPayload;

            // generate new AT and RT
            const payload = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
            };
            const newAccessToken = jwt.sign(
              payload,
              env.JWT_ACCESS_KEY as string,
            );
            const newRefreshToken = jwt.sign(
              payload,
              env.JWT_REFRESH_KEY as string,
            );

            // set cookie & save to userService DB
            res
              .cookie("accessToken", newAccessToken, { httpOnly: true })
              .cookie("refreshToken", newRefreshToken, { httpOnly: true });
            next();
          } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
              console.error(error);
              return res
                .status(401)
                .json({ message: "Unauthorized. Invalid token", error });
            }
            if (error instanceof jwt.TokenExpiredError) {
              return res
                .status(401)
                .json({ message: "Unauthorized. Token expired" });
            }
            return res.status(500).json({ message: "Internal server error" });
          }
        }
        console.log("Regenerating new set of tokens...");
        console.log(error);
        return res
          .status(404)
          .json({ message: "Re-send request please, data is being loaded..." });
      }
    }
  }
  next();
}

export default checkAuth;
