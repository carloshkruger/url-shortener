"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

type CopyLinkButtonProps = {
  shortUrl: string;
};

export function CopyLinkButton({ shortUrl }: CopyLinkButtonProps) {
  function handleCopy() {
    navigator.clipboard.writeText(shortUrl);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  }

  return (
    <Button
      variant="ghost"
      title="Copy link"
      className="p-2"
      onClick={handleCopy}
    >
      <Copy />
    </Button>
  );
}
