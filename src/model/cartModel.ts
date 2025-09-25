import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  subtotal: number;
  createdby:string
}

const cartSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const CartItem = mongoose.model<ICartItem>("CartItem", cartSchema);

export default CartItem;
