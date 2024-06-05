import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { authTokenSchema } from "@/types/authTokenSchema";

type requiredRoles = string[];

export function useAuth(requiredRoles: requiredRoles = []) {
  const router = useRouter();
  const authToken =
    typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;

  useEffect(() => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwt.decode(authToken) as authTokenSchema;

      if (!decodedToken) {
        throw new Error("Invalid token");
      }

      if (requiredRoles.includes(decodedToken.role)) {
        // User has required role
      } else {
        router.push("/errors/unauthorized");
      }
    } catch (error) {
      console.error("Error decoding authToken:", error);
      sessionStorage.removeItem("authToken");
      router.push("/login");
    }
  }, [authToken, requiredRoles, router]);

  return authToken;
}
