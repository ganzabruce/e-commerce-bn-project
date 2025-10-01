import { Request, Response } from "express";
import User from "../model/userModel";
import CartItem from "../model/cartModel";
import Product from "../model/productModel";
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if(!productId || quantity == null){
      return res.status(400).json({error: "please fill all required data"})
    }else if(isNaN(quantity)){
      return res.status(400).json({error: "please send the quantity as a number "})
    }else if(quantity <= 0){
      return res.status(400).json({error:"please send the quantity of products you need as number greater that 0"})
    }
    const userId= req.userId
    console.log(userId)
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    if(quantity > product?.quantity){
      return res.status(404).json({error: `the requested amount of products is greater than what we currently have in the stock, we only have ${product?.quantity} while you reqested ${quantity}`})
    }
    let cartItem = await CartItem.findOne({ productId, createdBy: userId });
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * product.price;
      await cartItem.save();
      // Populate the updated cart item
      const populatedCartItem = await CartItem.findById(cartItem._id).populate({
        path: 'productId',
        select: 'name price description imageUrl category quantity'
      });
      return res.status(200).json({cartItem: populatedCartItem});
    }
    const newCartItem = await CartItem.create({
      createdBy: userId,
      productId,
      quantity,
      subtotal: quantity * product.price,
    });
    // Populate the new cart item
    const populatedNewCartItem = await CartItem.findById(newCartItem._id).populate({
      path: 'productId',
      select: 'name price description imageUrl category quantity'
    });
    return res.status(201).json({newCartItem: populatedNewCartItem});
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ error: `Internal server error. ${error} ` });
  }
};
export const getCart = async (req: Request, res: Response) => {
  try {
    const user = req.userId
    const cartItems = await CartItem.find({createdBy: user}).populate({
      path: 'productId',
      select: 'name price description imageUrl category quantity'
    });
    return res.status(200).json({cartItems});
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cart items." });
  }
};
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if(!productId){
      return res.status(400).json({error: "please send the product id in params"})
    }else if(quantity == null){
      return res.status(400).json({error: "please provide the quantity value"})
    }else if(isNaN(quantity)){
      return res.status(400).json({error: "please send the quantity as a number "})
    }else if(quantity <= 0){
      return res.status(400).json({error:"please send the quantity of products you need as number greater that 0"})
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found." });
    const user = req.userId
    const cartItem = await CartItem.findOne({ productId, createdBy: user });
    if (!cartItem) return res.status(404).json({ error: "Item not in cart." });
    cartItem.quantity = quantity;
    cartItem.subtotal = quantity * product.price;
    await cartItem.save();
    // Populate the updated cart item
    const populatedCartItem = await CartItem.findById(cartItem._id).populate({
      path: 'productId',
      select: 'name price description imageUrl category quantity'
    });
    return res.status(200).json({cartItem: populatedCartItem});
  } catch (error) {
    return res.status(500).json({ error: "Failed to update cart item." });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;
    const deletedItem = await CartItem.findOneAndDelete({ productId, createdBy: userId });
    if (!deletedItem)
      return res.status(404).json({ error: "Item not found in cart." });
    return res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to remove item." });
  }
};
