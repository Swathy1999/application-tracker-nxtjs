import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/library/mongodb";
import { getUserId } from "@/library/auth";
import Application from "@/models/applicationModel";

type RouteContext = { params: Promise<{ id: string }> };

async function getAuthorizedUser(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return null;
  return userId;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await getAuthorizedUser(req);
    if (!userId)
      return NextResponse.json({ message: "Please login" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid application ID" },
        { status: 400 },
      );
    }

    await connectDB();
    const application = await Application.findOne({ _id: id, userId });
    if (!application)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);
    return NextResponse.json(
      { message: "Unable to fetch application" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await getAuthorizedUser(req);
    if (!userId)
      return NextResponse.json({ message: "Please login" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid application ID" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const allowedFields = [
      "company",
      "role",
      "location",
      "jobType",
      "salary",
      "appliedDate",
      "status",
      "interviewDate",
      "jobLink",
      "notes",
    ] as const;
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    if (typeof updateData.company == "string")
      updateData.company = updateData.company.trim();
    if (typeof updateData.role == "string")
      updateData.role = updateData.role.trim();
    if (
      updateData.appliedDate &&
      Number.isNaN(Date.parse(String(updateData.appliedDate)))
    ) {
      return NextResponse.json(
        { message: "Invalid applied date" },
        { status: 400 },
      );
    }
    if (updateData.appliedDate)
      updateData.appliedDate = new Date(String(updateData.appliedDate));
    if (updateData.interviewDate == "") updateData.interviewDate = null;
    else if (updateData.interviewDate) {
      if (Number.isNaN(Date.parse(String(updateData.interviewDate)))) {
        return NextResponse.json(
          { message: "Invalid interview date" },
          { status: 400 },
        );
      }
      updateData.interviewDate = new Date(String(updateData.interviewDate));
    }

    await connectDB();
    const application = await Application.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!application)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );
    return NextResponse.json(
      { message: "Application updated", application },
      { status: 200 },
    );
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);
    return NextResponse.json(
      { message: "Unable to update application" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const userId = await getAuthorizedUser(req);
    if (!userId)
      return NextResponse.json({ message: "Please login" }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid application ID" },
        { status: 400 },
      );
    }

    await connectDB();
    const application = await Application.findOneAndDelete({ _id: id, userId });
    if (!application)
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 },
      );

    return NextResponse.json(
      { message: "Application deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    return NextResponse.json(
      { message: "Unable to delete application" },
      { status: 500 },
    );
  }
}
