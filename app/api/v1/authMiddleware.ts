// authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function authenticate(req: NextRequest): Promise<boolean> {
  const { headers } = req;

  if (!headers.has("authToken")) {
    return false;
  }

  const authToken = headers.get("authToken");

  try {
    await jwt.verify(authToken!, process.env.JWT_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
}
