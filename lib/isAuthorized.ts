"use server";
import { logger } from "devdad-express-utils";
import { cookies } from "next/headers";

export const isUserAuthorized = async () => {
  logger.info("Authorization Func Called:");
  const cookieStore = await cookies();
  const userSession = cookieStore.get("user_session");
  let user = null;

  if (userSession) {
    try {
      user = JSON.parse(userSession.value);
    } catch (error: unknown) {
      console.error(error);
      logger.error("Failed TO Authorize User: ", { error });
    }
  }

  return user;
};
