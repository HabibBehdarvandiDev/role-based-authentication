import jwt from "jsonwebtoken";

export function isAdmin(authToken: string) {
  if (authToken) {
    try {
      const decodedToken = jwt.decode(authToken);

      if (
        decodedToken &&
        typeof decodedToken === "object" &&
        "role" in decodedToken
      ) {
        if (
          decodedToken.role === "admin" ||
          decodedToken.role === "developer"
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }

  return false;
}
