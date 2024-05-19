import { getServerSession } from "next-auth";
import { SignInForm } from "./_components/SignInForm";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/");
  }

  return (
    <div className="w-full max-w-5xl m-auto px-4">
      <h1 className="text-5xl text-center py-10">Sign in</h1>

      <SignInForm />
    </div>
  );
}
