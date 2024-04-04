import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { SignUpRequestSchema } from "./schema";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

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

  const validation = SignUpRequestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error.format(),
      },
      { status: 404 }
    );
  }

  const { first_name, last_name, username, password, role, permission } =
    validation.data;

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
      permission: permission ? permission : { read: true },
    },
  });

  return NextResponse.json(newUser, { status: 200 });
}
