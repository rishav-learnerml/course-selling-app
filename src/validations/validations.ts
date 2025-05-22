import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(5).max(20),
    email: z.string().min(5).max(30).email(),
    password: z.string().min(6).max(20),
  })
  .strict();

export const signInSchema = z
  .object({
    email: z.string().min(5).max(30).email(),
    password: z.string().min(6).max(20),
  })
  .strict();