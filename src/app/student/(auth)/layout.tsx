import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Login",
  description: "Sign in to access your RCI Student Portal, courses, fee receipts, and certificates.",
};

export default function StudentAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
