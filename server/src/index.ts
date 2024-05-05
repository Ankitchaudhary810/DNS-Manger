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
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);

app.use("/api/v1", domainRouter);
app.use("/api/v1", dnsRecordRouter);

mongooseConnection();
const port = PORT || 4000;
app.listen(port, () => {
  console.log("server is running at ", port);
});
