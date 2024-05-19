import { UrlFormType } from "@/schemas/url-form";

export async function shortenUrl(data: UrlFormType, accessToken: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/links/shorten`,
    {
      method: "POST",
      body: JSON.stringify({
        url: data.url,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Something went wront.");
  }
}