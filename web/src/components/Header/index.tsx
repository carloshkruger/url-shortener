import Link from "next/link";
import { Button } from "../ui/button";
import { getServerSession } from "next-auth";
import { LogoutButton } from "./LogoutButton";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "../ThemeToggle";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="bg-primary-foreground w-full shadow-md p-3 md:p-6">
      <div className="flex justify-between items-center w-full max-w-5xl m-auto">
        <Link href="/">
          <span className="text-primary text-bold text-3xl">Shorty</span>
        </Link>

        <nav className="flex items-center">
          {session && <LogoutButton className="text-primary text-lg" />}

          {!session && (
            <>
              <Button asChild variant="link" className="text-primary text-lg">
                <Link href="sign-in">Sign in</Link>
              </Button>
              <Button asChild variant="link" className="text-primary text-lg">
                <Link href="sign-up">Sign up</Link>
              </Button>
            </>
          )}

          <ThemeToggle className="text-primary" />
        </nav>
      </div>
    </header>
  );
}
