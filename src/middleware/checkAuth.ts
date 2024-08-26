import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserPayload } from "../entities/user.payload";

async function checkAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.cookie?.split(/[=;]+/);

  // Check Token's presence
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const accessToken = token[1];
  const refreshToken = token[3];

  try {
    // Verify accessToken
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY as string,
    ) as IUserPayload;

    // Check RT on userService DB
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY as string);

    // generate new AT and RT
    const payload = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
    };
    const newAccessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_KEY as string,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_KEY as string,
      { expiresIn: "7d" },
    );

    // next
    next();

    // set cookie & save to userService DB
    return res
      .cookie("accessToken", newAccessToken, { httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true });
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
        .json({ message: "Unauthorized. Token expired", error });
    }
    return res.status(500).json({ message: "Internal server error", error });
  }
}

export default checkAuth;
