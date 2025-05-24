import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../schema/AdminSchema";
import {
  courseSchema,
  signInSchema,
  signupSchema,
} from "../validations/validations";
import adminMiddleware from "../middleware/admin";
import { Course } from "../schema/CourseSchema";

const JWT_SECRET = process.env.JWT_SECRET_ADMIN;

const adminRouter = Router();

adminRouter.post("/signup", async (req: Request, res: Response) => {
  const admindata = req.body;
  try {
    const { success, error } = signupSchema.safeParse(admindata);
    if (success) {
      const { username, password, email } = admindata;
      const hashedPassword = await bcrypt.hash(password, 5);

      //save to db
      const admin = await Admin.create({
        username,
        password: hashedPassword,
        email,
      });
      //generate jwt and send
      const token = jwt.sign({ id: admin._id }, JWT_SECRET as string);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "Admin Signed Up Succesfully" });
    } else {
      const errors = error.issues.map((issue) => issue.message);
      res.status(400).json({ message: errors.join(",") });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

adminRouter.post("/signin", async (req: Request, res: Response) => {
  const admindata = req.body;
  try {
    const { success, error } = signInSchema.safeParse(admindata);
    if (success) {
      //find user in db
      const { password, email } = admindata;
      const admin = await Admin.findOne({
        email,
      });

      if (!admin) {
        throw new Error("Admin not found!");
      }

      const isPasswordCorrect = await bcrypt.compare(password, admin.password);
      if (!isPasswordCorrect) {
        throw new Error("Password is wrong!");
      }
      //generate jwt and send
      const token = jwt.sign({ id: admin._id }, JWT_SECRET as string);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.json({ message: "Adin Signed In Succesfully" });
    } else {
      const errors = error.issues.map((issue) => issue.message);
      res.status(400).json({ message: errors.join(",") });
    }
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

adminRouter.post(
  "/course",
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const adminId = (req as any).userId;
      //todo - convert binary image to cloudinary url

      const coursedata = req.body;
      // const { title, description, imageUrl, price } = coursedata;

      const { success, error } = courseSchema.safeParse(coursedata);

      if (success) {
        const course = await Course.create({
          ...coursedata,
          creatorId: adminId,
        });

        res.json({
          message: "course created succesfully!",
          courseId: course._id,
        });
      } else {
        const errors = error.issues.map((issue) => issue.message);
        res.status(400).json({ message: errors.join(",") });
      }
    } catch (error) {
      res.status(400).json({ message: "something went wrong!", error });
    }
  }
);

adminRouter.put("/course",adminMiddleware, (req: Request, res: Response) => {

});

adminRouter.get("/course/bulk",adminMiddleware, (req: Request, res: Response) => {});

export default adminRouter;
