export async function getOriginalUrl(shortUrl: string): Promise<string | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/links/original/${shortUrl}`
  );
  const data = await response.json();
  if (response.ok) {
    return data.url;
  }
  return null;
}
