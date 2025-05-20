import express, { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectToDb from "./db/db";

import { User } from "./schema/UserSchema";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

const signupSchema = z
  .object({
    username: z.string().min(5).max(20),
    email: z.string().min(5).max(30).email(),
    password: z.string().min(6).max(20),
  })
  .strict();

const signInSchema = z
  .object({
    email: z.string().min(5).max(30).email(),
    password: z.string().min(6).max(20),
  })
  .strict();

app.post("/signup", async (req: Request, res: Response) => {
  const userdata = req.body;
  try {
    const { success, error } = signupSchema.safeParse(userdata);
    if (success) {
      const hashedPassword = await bcrypt.hash(userdata.password, 5);

      //save to db
      await User.create({
        username: userdata.username,
        password: hashedPassword,
        email: userdata.email,
      });
      //generate jwt and send
      const token = jwt.sign(
        { username: userdata.username },
        JWT_SECRET as string
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "Signed Up Succesfully" });
    } else {
      res.status(400).json({ message: error.issues[0].message });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    const { success, error } = signInSchema.safeParse(userData);
    if (success) {
      //find user in db
      const user = await User.findOne({
        email: userData.email,
      });

      if (!user) {
        throw new Error("User not found!");
      }

      const isPasswordCorrect = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Password is wrong!");
      }
      //generate jwt and send
      const token = jwt.sign(
        { username: userData.username },
        JWT_SECRET as string
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "Signed In Succesfully" });
    } else {
      res.status(400).json({ message: error.issues[0].message });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

connectToDb()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server Listening on PORT : http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error : ", err));
