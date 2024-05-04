import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongooseConnection from "./db";
import DnsRouter from "./routes/index";
const app = express();

dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);

app.use("/api/v1", DnsRouter);

mongooseConnection();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server is running..");
});
