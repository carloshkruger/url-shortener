import { SignUpFormType } from "@/schemas/sign-up-form";

export async function signUp(data: SignUpFormType): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData?.message ?? "Something went wrong")
  }
}