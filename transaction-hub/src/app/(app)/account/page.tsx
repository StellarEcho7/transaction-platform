"use client";

import { useSession } from "next-auth/react";
import AccountView from "./AccountView";

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <AccountView
      name={session?.user?.name || null}
      email={session?.user?.email}
      role={session?.user?.role || "USER"}
    />
  );
}
