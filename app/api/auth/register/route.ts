import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/library/mongodb";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name == "string" ? body.name.trim() : "";
    const email =
      typeof body.email == "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password == "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role: "user" });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { message: "Unable to register user" },
      { status: 500 },
    );
  }
}
