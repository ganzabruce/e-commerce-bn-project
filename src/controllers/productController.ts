import { Request, Response } from "express";
import Product from "../model/productModel";
export const saveProduct = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, price, description, imageUrl, category, quantity } = req.body;

    if(!name || price == null || !description || !imageUrl || !category || quantity == null){
      return res.status(400).json({error: "please fill all required fields"})
    }else if(isNaN(price) || isNaN(quantity)){
      return res.status(400).json({error: "the price and quantity field must all be numbers"})
    }
    if(price <= 0){
      return res.status(400).json({error:"the price of product must be greater than 1"})
    }
    const newProduct = await Product.create({
      name: name,
      price,
      description,
      imageUrl,
      category,
      quantity
    });
    return res.status(201).json({newProduct});
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ error: `Internal server error : ${error}` });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    console.log(products);
    return res.json({products: products});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};
export const getCategories = async (req: Request, res: Response) => {
  interface ProductsInterface{
    _id:string
    name:string
    price:number
    description:string
    imageUrl:string
    category:string
  }
  
  try {
    const products = await Product.find();
    console.log(products);
    return res.json({id:products,name:products});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    console.log(product)
    res.status(200).json({product});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {name, price, description, imageUrl, category , quantity} = req.body
    if(!name || price == null || !description || !imageUrl || !category || quantity == null){
      return res.status(400).json({error: "please fill all required fields"})
    }else if(isNaN(price) || isNaN(quantity)){
      return res.status(400).json({error: "the price and quantity fields must all be numbers"})
    }
    if(price <= 0){
      return res.status(400).json({error:"the price of product must be greater than 1"})
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found." });
    return res.status(200).json({updatedProduct});
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found." });
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product." });
  }
};