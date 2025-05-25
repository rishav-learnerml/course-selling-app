import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../schema/UserSchema";
import { signInSchema, signupSchema } from "../validations/validations";
import { Purchase } from "../schema/PurchaseSchema";
import userMiddleware from "../middleware/user";

const JWT_SECRET = process.env.JWT_SECRET_USER;

const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
  const userdata = req.body;
  try {
    const { success, error } = signupSchema.safeParse(userdata);
    if (success) {
      const { username, password, email } = userdata;
      const hashedPassword = await bcrypt.hash(password, 5);

      //save to db
      const user = await User.create({
        username,
        password: hashedPassword,
        email,
      });
      //generate jwt and send
      const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
        expiresIn: "15m",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "User Signed Up Succesfully" });
    } else {
      const errors = error.issues.map((issue) => issue.message);
      res.status(400).json({ message: errors.join(",") });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
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
      const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
        expiresIn: "15m",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "User Signed In Succesfully" });
    } else {
      const errors = error.issues.map((issue) => issue.message);
      res.status(400).json({ message: errors.join(",") });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

userRouter.post('/purchase', userMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const courseId = req.body.courseId;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized User" });
        return;
    }

    if (!courseId) {
        res.status(400).json({ message: "Course ID is required" });
        return;
    }

    try {
        await Purchase.create({
            userId,
            courseId,
        });

        res.status(200).json({ message: "Course purchased successfully!" });
    } catch (error) {
        res.status(400).json({ message: "Unable to purchase course!", error });
    }
});

userRouter.get("/purchased", async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized User" });
        return;
    }
    try {
        const purchases = await Purchase.find({ userId });

        if (!purchases || !purchases.length) {
            res.status(404).json({ message: "No purchases found" });
            return;
        }
        
        res.json({ message: "Purchased courses fetched successfully!", purchases });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong!", error });
    }
});

export default userRouter;
