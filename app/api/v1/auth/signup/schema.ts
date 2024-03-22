import { ZodEnum, z } from "zod";
import { UserRole } from "@prisma/client";

// Define a function to extract enum values
const extractEnumValues = <T extends Record<string, string | number>>(
  enumObject: T
) => {
  return Object.values(enumObject).filter(
    (value) => typeof value === "string"
  ) as string[];
};

const userRoleValues = extractEnumValues(UserRole);

const SignUpRequestSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.enum(userRoleValues as [string, ...string[]]),
});

export { SignUpRequestSchema };
