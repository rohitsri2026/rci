import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure login for RCI Institute administrators and staff personnel.",
};

export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
