import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
