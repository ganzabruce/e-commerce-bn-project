import { Request, Response } from "express";
import Blog from "../model/blogsModel";

// Get all blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch blogs: ${error.message}` });
  }
};

// Get single blog by ID
export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const singleBlog = await Blog.findById(id);

    if (!singleBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(singleBlog);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to fetch blog: ${error.message}` });
  }
};

// Create new blog
export const newBlog = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const blog = await Blog.create({ title });
    res.status(201).json(blog);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to create blog: ${error.message}` });
  }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title },
      { new: true } // return updated doc
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error: any) {
    res.status(500).json({ error: `Failed to update blog: ${error.message}` });
  }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: `Failed to delete blog: ${error.message}` });
  }
};
