import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import AccountView from "@/src/components/AccountView";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <AccountView
      name={session?.user?.name || null}
      email={session?.user?.email}
      role={session?.user?.role || "USER"}
    />
  );
}
