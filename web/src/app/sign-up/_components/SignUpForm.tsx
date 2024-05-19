"use client";

import { signUp } from "@/actions/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputError } from "@/components/ui/input-error";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { SignUpFormType, signUpSchema } from "@/schemas/sign-up-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function SignUpForm() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const handleSignUp = handleSubmit(async (data: SignUpFormType) => {
    try {
      await signUp(data);

      router.push("/sign-in");
    } catch (error: any) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="w-full max-w-5xl m-auto px-4">
      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" {...register("name")} />
          <InputError message={errors.name?.message} />
        </div>
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
          Sign up
        </Button>
      </form>
    </div>
  );
}
