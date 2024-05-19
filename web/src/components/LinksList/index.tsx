import { Session } from "next-auth";
import { Cards } from "./Cards";
import { getUserLinks } from "@/actions/get-user-links";

export async function LinksList({ session }: { session: Session | null }) {
  if (!session) {
    return null;
  }

  const links = await getUserLinks(session.accessToken);

  return (
    <div className="flex flex-col gap-4 pt-10">
      <Cards links={links} />
    </div>
  );
}
