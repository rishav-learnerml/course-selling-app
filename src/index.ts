import express from "express";
import dotenv from "dotenv";
import connectToDb from "./db/db";
import userRouter from "./routes/userRouter";
import courseRouter from "./routes/courseRouter";
import adminRouter from "./routes/adminRouter";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Listening on PORT : http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Error : ", err));
