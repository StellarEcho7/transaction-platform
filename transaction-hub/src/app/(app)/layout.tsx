import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Box from "@/src/components/Box";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
