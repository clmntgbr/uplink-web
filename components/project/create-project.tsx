"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProject } from "@/lib/project/context";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface CreateProjectDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateProject({ open, onOpenChange }: CreateProjectDialogProps) {
  const { createProject } = useProject();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={() => setIsOpen(true)} className="w-full justify-start font-normal">
          <PlusIcon className="-ms-2 opacity-60 mr-1" aria-hidden="true" />
          Create project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project to monitor.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
