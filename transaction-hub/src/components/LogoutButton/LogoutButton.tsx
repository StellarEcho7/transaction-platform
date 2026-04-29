"use client";

import { signOut } from "next-auth/react";
import Button from "@/src/components/Button";

interface LogoutButtonProps {
  callbackUrl?: string;
}

export default function LogoutButton({
  callbackUrl = "/login",
}: LogoutButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={() => signOut({ callbackUrl })}
      sx={{ ml: 2 }}
    >
      Logout
    </Button>
  );
}
