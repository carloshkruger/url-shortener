"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { ComponentProps } from "react";

type LogoutButtonProps = ComponentProps<"button">;

export function LogoutButton({ ...props }: LogoutButtonProps) {
  async function handleLogout() {
    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <Button variant="link" onClick={handleLogout} {...props}>
      Logout
    </Button>
  );
}
