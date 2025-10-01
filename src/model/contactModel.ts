import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  name: string,
  email: string,
  phone: string,
  message:string
}

const contactSchema: Schema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    message:String
  },
  { timestamps: true }
);
const Contact = mongoose.model<IContact>("Contact", contactSchema);
export default Contact;
