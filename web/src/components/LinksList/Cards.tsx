"use client";

import { Card, CardContent } from "../ui/card";
import { CopyLinkButton } from "./CopyLinkButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { Link } from "@/schemas/link";
import { deleteLink } from "@/actions/delete-link";

type CardsProps = {
  links: Link[];
};

export function Cards({ links }: CardsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkForDeletion, setLinkForDeletion] = useState<Link | null>(null);
  const router = useRouter();
  const session = useSession();

  function handleShowDeletionModal(link: Link) {
    setLinkForDeletion(link);
  }

  async function handleDeleteLink() {
    if (!linkForDeletion) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteLink(linkForDeletion?.id, session.data?.accessToken ?? "");

      handleCloseModal();
      router.refresh();
    } catch (error: any) {
      toast({
        title: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCloseModal() {
    setLinkForDeletion(null);
  }

  return (
    <>
      {links.map((link) => (
        <Card key={link.id}>
          <CardContent className="flex justify-between items-center pt-6">
            <div className="truncate">
              <strong>{link.shortUrl}</strong>
              <p className="truncate">{link.longUrl}</p>
            </div>
            <div className="flex">
              <CopyLinkButton shortUrl={link.shortUrl} />
              <Button
                onClick={() => handleShowDeletionModal(link)}
                variant="ghost"
                title="Delete link"
                className="p-2"
              >
                <Trash />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!linkForDeletion} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="destructive"
              type="button"
              onClick={handleDeleteLink}
              disabled={isDeleting}
            >
              Yes, delete the link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
