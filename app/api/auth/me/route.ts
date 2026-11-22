import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/library/mongodb";
import { getUserId } from "@/library/auth";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("name email role");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    return NextResponse.json(
      { message: "Unable to get user" },
      { status: 500 },
    );
  }
}
