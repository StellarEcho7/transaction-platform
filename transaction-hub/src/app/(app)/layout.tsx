import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoggedInLayout from "@/src/components/LoggedInLayout";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <LoggedInLayout>{children}</LoggedInLayout>;
}