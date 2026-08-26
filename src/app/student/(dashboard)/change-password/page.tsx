import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/student/ChangePasswordForm";

type Props = {
  searchParams: Promise<{ firstLogin?: string }>;
};

export default async function StudentChangePasswordPage({ searchParams }: Props) {
  const { student, user, mustChangePassword } = await getStudentSession();
  if (!student || !user) {
    redirect("/student/login");
  }

  const { firstLogin } = await searchParams;
  const isFirstTime = firstLogin === "true" || mustChangePassword;

  return (
    <div className="py-6">
      <ChangePasswordForm isFirstLogin={isFirstTime} />
    </div>
  );
}
