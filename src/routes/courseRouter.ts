import { Request, Response, Router } from "express";
import { Course } from "../schema/CourseSchema";

const courseRouter = Router();

courseRouter.get("/all", async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({});
    if (!courses || !courses.length) {
      res.status(404).json({ message: "No courses found" });
      return;
    }
    res.json({ message: "Courses fetched succesfully!", courses });
  } catch (error) {
    res.status(400).json({ message: "something went wrong!", error });
  }
});

export default courseRouter;
