import mongoose from "mongoose";

export type ApplicationStatus = "Applied" | "Interview" | "Selected" | "Rejected";

export interface IApplication {
  company: string;
  role: string;
  location: string;
  jobType: string;
  salary: string;
  appliedDate: Date;
  status: ApplicationStatus;
  interviewDate?: Date | null;
  jobLink: string;
  notes: string;
  userId: mongoose.Types.ObjectId;
}

const applicationSchema = new mongoose.Schema<IApplication>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    jobType: { type: String, default: "Full-time" },
    salary: { type: String, default: "" },
    appliedDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    interviewDate: { type: Date, default: null },
    jobLink: { type: String, default: "" },
    notes: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);

export default Application;
