import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  quantity: number;
}




const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true,min:1},
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    quantity: {type: Number , required: true, min: 0}
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
