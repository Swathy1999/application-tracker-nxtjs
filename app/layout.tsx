import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "CareerTrack | Job Application Tracker",
  description: "Organize your job search in one place.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
