export async function deleteLink(linkId: string, accessToken: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/links/${linkId}`,
    {
      method: "DELETE",
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