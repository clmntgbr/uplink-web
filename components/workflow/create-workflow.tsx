"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useWorkflow } from "@/lib/workflow/context";
import { createWorkflowSchema } from "@/lib/workflow/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputWithLabel } from "../input-with-label";
import { Spinner } from "../ui/spinner";

export function CreateWorkflow() {
  const { createWorkflow } = useWorkflow();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof createWorkflowSchema>>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  const onSubmit = async (data: z.infer<typeof createWorkflowSchema>) => {
    setIsLoading(true);
    try {
      await createWorkflow(data);
      reset();
      setOpen(false);
    } catch {
      toast.error("Failed to create workflow", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button>
          <Plus />
          <span>Create Workflow</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl py-8">
          <DrawerHeader>
            <DrawerTitle className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              Create a new workflow to automate your processes
            </DrawerTitle>
          </DrawerHeader>
          <form id="create-workflow-form" className="p-4 pb-0 space-y-8">
            <div className="group relative w-full">
              <InputWithLabel label="Name" disabled={isLoading} error={errors.name?.message} {...register("name")} />
            </div>
            <div className="group relative w-full">
              <InputWithLabel label="Description" disabled={isLoading} error={errors.description?.message} {...register("description")} />
            </div>
          </form>
          <DrawerFooter>
            <div className="flex items-center justify-end w-full space-x-2">
              <DrawerClose asChild>
                <Button variant="outline" type="button" onClick={() => reset()} disabled={isLoading}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" form="create-project-form" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                Submit {isLoading && <Spinner />}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
