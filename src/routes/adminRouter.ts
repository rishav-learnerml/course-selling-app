import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../schema/UserSchema";
import { signInSchema, signupSchema } from "../validations/validations";

const JWT_SECRET = process.env.JWT_SECRET;

const adminRouter = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  const userdata = req.body;
  try {
    const { success, error } = signupSchema.safeParse(userdata);
    if (success) {
      const { username, password, email } = userdata;
      const hashedPassword = await bcrypt.hash(password, 5);

      //save to db
      await User.create({
        username,
        password: hashedPassword,
        email,
      });
      //generate jwt and send
      const token = jwt.sign({ username }, JWT_SECRET as string);
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

adminRouter.post("/signin", async (req: Request, res: Response) => {
  const userdata = req.body;
  try {
    const { success, error } = signInSchema.safeParse(userdata);
    if (success) {
      //find user in db
      const { password, email } = userdata;
      const user = await User.findOne({
        email,
      });

      if (!user) {
        throw new Error("User not found!");
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new Error("Password is wrong!");
      }
      //generate jwt and send
      const token = jwt.sign(
        { username: user.username },
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

adminRouter.post("/course", (req: Request, res: Response) => {});
adminRouter.put("/course", (req: Request, res: Response) => {});
adminRouter.get("/course/bulk", (req: Request, res: Response) => {});

export default adminRouter;
