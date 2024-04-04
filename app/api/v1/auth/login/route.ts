import { NextRequest, NextResponse } from "next/server";
import { LoginSchemaRequest } from "./schema";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
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

  const validation = LoginSchemaRequest.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 404 });
  }

  const { username, password } = validation.data;

  const isUserExist = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!isUserExist) {
    return NextResponse.json(
      {
        error: "User does not exist",
      },
      { status: 404 }
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);

  if (!isPasswordMatch) {
    return NextResponse.json(
      {
        error: "Invalid credentials",
      },
      { status: 404 }
    );
  }

  const jwtPayload = {
    first_name: isUserExist.first_name,
    last_name: isUserExist.last_name,
    username: isUserExist.username,
    role: isUserExist.role,
    permission: isUserExist.permission,
  };

  const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: 3600,
  });

  return NextResponse.json(
    { status: 200, authToken: authToken },
    { status: 200 }
  );
}
