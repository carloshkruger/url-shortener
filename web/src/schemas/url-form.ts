import { z } from "zod";
import isURL from "validator/lib/isURL";

export const urlFormSchema = z.object({
  url: z
    .string()
    .trim()
    .refine(
      (value) => isURL(value, { require_protocol: false }),
      "Inform a valid URL"
    ),
});

export type UrlFormType = z.infer<typeof urlFormSchema>;