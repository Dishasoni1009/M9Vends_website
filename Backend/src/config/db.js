// src/config/db.js
import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: ENV.NODE_ENV !== "production", // disable auto index in prod
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error(" MongoDB Connection Failed");
    console.error(error.message);

    // Exit process in production
    process.exit(1);
  }
};
