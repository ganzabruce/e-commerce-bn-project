import mongoose, {Schema,Document} from "mongoose";

export interface IAdmin extends Document {
    email:string;
    password:string;
}

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 30
    }
})
const Admin = mongoose.model<IAdmin>("Admin",adminSchema)
export default Admin;