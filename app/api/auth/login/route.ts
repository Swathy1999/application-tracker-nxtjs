import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/library/mongodb";
import User from "@/models/userModel";
import { createToken } from "@/library/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email =
      typeof body.email == "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password == "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const token = createToken(
      user._id.toString(),
      user.email,
      user.role || "user",
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json({ message: "Unable to login" }, { status: 500 });
  }
}
