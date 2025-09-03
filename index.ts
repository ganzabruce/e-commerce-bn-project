import express from "express";
import dotenv from "dotenv";
import router from "./src/routes/router";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = 3000
app.use(express.json())
app.use("/api",router)
mongoose.connect("mongodb+srv://bruce:lSvY3ij367vy8d1g@cluster0.emzrdoq.mongodb.net/blogs-db")
  .then(()=>{
    app.listen(PORT,()=>{
      console.log("well connected to the database")
      console.log(`your server is up running ${PORT}`)
    })
  })
  .catch((error)=>{
    console.log("failed to connect to the database: ",error)
  })

app.use(express.json());
app.use("/api", router)