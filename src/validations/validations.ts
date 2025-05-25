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

export const courseSchema = z
  .object({
    title: z.string().min(6).max(100),
    description: z.string().min(6).max(200),
    imageUrl: z.string().min(6),
    price: z.number(),
  })
  .strict();

export const courseSchemaUpdate = z
  .object({
    courseId: z.string(),
    title: z.string().min(6).max(100).optional(),
    description: z.string().min(6).max(200).optional(),
    imageUrl: z.string().min(6).optional(),
    price: z.number().optional(),
  })
  .strict();

