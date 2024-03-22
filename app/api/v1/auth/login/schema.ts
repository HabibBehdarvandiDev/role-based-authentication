import { z } from "zod";

const LoginSchemaRequest = z.object({
  username: z.string(),
  password: z.string(),
});

export { LoginSchemaRequest };
