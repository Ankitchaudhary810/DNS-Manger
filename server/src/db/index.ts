import mongoose from "mongoose";

function mongooseConnection() {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log("mongodb connected."))
    .catch((e) => console.log(e));
}

export default mongooseConnection;
