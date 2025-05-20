import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;

const connectToDb = async () => {
  try {
    const res = await mongoose.connect(url as string);
    console.log("Succesfully Connected to DB!");
  } catch (error) {
    console.error("Error connecting to Database! ", error);
  }
};

export default connectToDb;
