import { getOriginalUrl } from "@/actions/get-original-url";
import { redirect } from "next/navigation";

type UrlRedirectPageProps = {
  params: { shortUrl: string };
};

export default async function UrlRedirectPage({
  params,
}: UrlRedirectPageProps) {
  const url = await getOriginalUrl(params.shortUrl);

  if (url) {
    return redirect(url);
  }

  return (
    <p className="text-primary text-center text-2xl pt-10">Link not found</p>
  );
}
