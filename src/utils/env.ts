import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: str(),
  HOST: str(),
  JWT_ACCESS_KEY: str(),
  JWT_REFRESH_KEY: str(),
  HOST_USERS_SERVICE: str(),
  HOST_THREADS_SERVICE: str(),
  HOST_REPLIES_SERVICE: str(),
  HOST_NOTIFICATIONS_SERVICE: str(),
});
