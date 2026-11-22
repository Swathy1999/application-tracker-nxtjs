import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/library/mongodb";
import { getUserId } from "@/library/auth";
import Application from "@/models/applicationModel";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    await connectDB();
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);
    return NextResponse.json({ message: "Unable to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "Please login" }, { status: 401 });
    }

    const body = await req.json();
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const appliedDate = body.appliedDate;

    if (!company || !role || !appliedDate || Number.isNaN(Date.parse(appliedDate))) {
      return NextResponse.json(
        { message: "A valid company, role and applied date are required" },
        { status: 400 },
      );
    }

    await connectDB();
    const application = await Application.create({
      company,
      role,
      location: body.location ?? "",
      jobType: body.jobType ?? "Full-time",
      salary: body.salary ?? "",
      appliedDate: new Date(appliedDate),
      status: body.status ?? "Applied",
      interviewDate: body.interviewDate ? new Date(body.interviewDate) : null,
      jobLink: body.jobLink ?? "",
      notes: body.notes ?? "",
      userId,
    });

    return NextResponse.json(
      { message: "Application added successfully", application },
      { status: 201 },
    );
  } catch (error) {
    console.error("ADD APPLICATION ERROR:", error);
    return NextResponse.json({ message: "Unable to add application" }, { status: 500 });
  }
}
