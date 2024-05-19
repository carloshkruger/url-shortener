"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputError } from "../ui/input-error";
import { toast } from "../ui/use-toast";
import { UrlFormType, urlFormSchema } from "@/schemas/url-form";
import { shortenUrl } from "@/actions/shorten-url";

export function ShortenUrlForm() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<UrlFormType>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });
  const { data: sessionData } = useSession();
  const router = useRouter();

  const handleShortenUrl = handleSubmit(async (data: UrlFormType) => {
    if (!sessionData) {
      toast({
        title: "You need to be logged in to shorten URLs",
        variant: "warning",
      });
      return;
    }

    try {
      await shortenUrl(data, sessionData.accessToken);

      reset();
      router.refresh();
    } catch (error: any) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    }
  });

  return (
    <form onSubmit={handleShortenUrl}>
      <div className="flex items-stretch flex-col md:flex-row">
        <Input
          placeholder="https://example.com"
          className="py-4 px-2 md:py-8 md:px-4 text-xl"
          {...register("url")}
        />
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 md:mt-0 text-md md:text-2xl h-full w-full md:w-auto"
          >
            Shorten URL
          </Button>
        </div>
      </div>
      <InputError message={errors.url?.message} />
    </form>
  );
}
