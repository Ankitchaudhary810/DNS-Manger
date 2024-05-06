import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

function mongooseConnection() {
  mongoose
    .connect(MONGODB_URI as string)
    .then(() => console.log("mongodb connected."))
    .catch((e) => console.log(e));
}

export default mongooseConnection;
