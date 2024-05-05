import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT;

export const MONGODB_URI = process.env.MONGODB_URI;

export const aws_access_key = process.env.aws_access_key;

export const aws_secret_key = process.env.aws_secret_key;

export const region = "ap-south-1";
