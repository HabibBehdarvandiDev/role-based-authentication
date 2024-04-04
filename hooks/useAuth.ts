import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { authTokenSchema } from "@/types/authTokenSchema";

export function useAuth() {
  const router = useRouter();
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwt.decode(authToken) as authTokenSchema;

      // Check if user has required role to access the route
      if (decodedToken.role === "admin" || decodedToken.role === "developer") {
        router.push("/dashboard");
      } else {
        router.push("/posts");
      }
    } catch (error) {
      console.error("Error decoding authToken:", error);
      router.push("/login");
    }
  }, []);

  return authToken;
}
