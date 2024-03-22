import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { SignUpRequestSchema } from "./schema";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../../authMiddleware";

export async function POST(req: NextRequest) {
  /* const { headers } = req;

  if (!headers.has("authToken")) {
    return NextResponse.json({
      error: "Unauthorized: Missing AuthToken",
    });
  }

  const authToken = headers.get("authToken");

  const tokenVerification = await jwt.verify(
    authToken!,
    process.env.JWT_SECRET!
  );

  if (!tokenVerification) {
    return NextResponse.json({
      error: "Unauthorized: Invalid AuthToken",
    });
  }
 */

  const isAuthenticated = await authenticate(req);
  if (!isAuthenticated) {
    return NextResponse.json({
      error: "Unauthorized: Invalid or Missing AuthToken",
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error parsing Body, Please Check the Body type and try again.",
      },
      { status: 404 }
    );
  }

  const validation = SignUpRequestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error.format(),
      },
      { status: 404 }
    );
  }

  const { first_name, last_name, username, password, role } = validation.data;

  const isUsernameUnique = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (isUsernameUnique) {
    return NextResponse.json(
      {
        error: "Username is already taken.",
      },
      { status: 404 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      first_name,
      last_name,
      username,
      password: hashedPassword,
      role: role as UserRole,
    },
  });

  return NextResponse.json(newUser, { status: 200 });
}
