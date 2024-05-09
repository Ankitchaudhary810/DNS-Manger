import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongooseConnection from "./db";
import domainRouter from "./routes/domain";
import dnsRecordRouter from "./routes/Dnsrecord";
import { PORT } from "./config";

const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @ts-ignore
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);

app.get("/", (req, res) => {
  res.send("DNS BACKEND WORKING....");
});
app.use("/api/v1", domainRouter);
app.use("/api/v1", dnsRecordRouter);

mongooseConnection();
const port = PORT || 4000;
app.listen(port, () => {
  console.log("server is running at ", port);
});
