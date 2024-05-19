import { ShortenUrlForm } from "@/components/ShortenUrlForm";
import { LinksList } from "@/components/LinksList";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full max-w-5xl m-auto px-4">
      <h1 className="text-4xl md:text-5xl text-center py-10">
        Create short URLs
      </h1>

      {!session && (
        <p className="text-primary text-xl text-center pb-10">
          To start, you first need to create an account or sign in if you
          already have one.
        </p>
      )}

      <ShortenUrlForm />

      <Suspense
        fallback={
          <p className="text-primary text-center pt-10">Loading links...</p>
        }
      >
        <LinksList session={session} />
      </Suspense>
    </div>
  );
}
