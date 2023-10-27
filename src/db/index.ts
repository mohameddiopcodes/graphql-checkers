import mongoose from "mongoose";

const URL = process.env.MONGODB_URL as string;

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((e) => {
    console.log(e);
  });
