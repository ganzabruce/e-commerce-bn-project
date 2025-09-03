import mongoose from "mongoose";

const Schema = mongoose.Schema

const blogsSchema = new Schema({
    title:{
        type:String,
        required:true
    }
},{timestamps:true})
const Blog = mongoose.model("Blogs", blogsSchema)
export default Blog