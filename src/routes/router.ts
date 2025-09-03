import express from "express";
import { getBlogs,getBlog,deletBlog,updateBlog, newBlog } from "../controllers/blogControllers";

const router = express.Router()
router.get("/blogs", getBlogs);
router.get("/blogs/:id", getBlog);
router.post("/blogs", newBlog);
router.put("/blogs/:id", updateBlog );
router.delete("/blogs/:id", deletBlog);

export default router 