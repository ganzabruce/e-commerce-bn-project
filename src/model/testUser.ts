import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  resetOtp?: string;         
  resetOtpExpiry?: Date;     
}
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpiry: {
    type: Date,
  },
});

const TestUser = mongoose.model<IUser>("TestUser", userSchema);
export default TestUser;
