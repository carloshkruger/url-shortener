import { Link } from "@/schemas/link";

export async function getUserLinks(accessToken: string): Promise<Link[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/links`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}