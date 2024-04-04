import { z } from "zod";

type authTokenSchema = {
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  permission: Record<string, boolean>;
};

type loginResponseSchema = {
  status: number;
  authToken: string;
};

export type { authTokenSchema, loginResponseSchema };
