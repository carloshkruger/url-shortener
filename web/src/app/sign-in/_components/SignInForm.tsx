"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputError } from "@/components/ui/input-error";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormType = z.infer<typeof signInSchema>;

export function SignInForm() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleSignIn = handleSubmit(async (data: SignInFormType) => {
    const response = await signIn("login", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.ok) {
      router.refresh();
    } else {
      toast({
        title: response?.error ?? "Invalid credentials",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="w-full max-w-5xl m-auto px-4">
      <form onSubmit={handleSignIn} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} />
          <InputError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          <InputError message={errors.password?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
