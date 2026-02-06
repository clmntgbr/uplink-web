"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useProject } from "@/lib/project/context";
import { createProjectSchema } from "@/lib/project/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

export function CreateProject() {
  const { createProject } = useProject();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
    setIsLoading(true);
    try {
      await createProject(data);
      reset();
      setOpen(false);
    } catch {
      toast.error("Failed to create project", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus />
          <span>Create Project</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl py-8">
          <DrawerHeader>
            <DrawerTitle className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
              Create a new project and collaborate with your team
            </DrawerTitle>
          </DrawerHeader>
          <form id="create-project-form" className="p-4 pb-0">
            <div className="group relative w-full">
              <Label
                htmlFor="project-name"
                className="bg-background absolute top-0 left-2 z-1 block -translate-y-1/2 px-1 text-xs aria-invalid:text-destructive"
                aria-invalid={errors.name ? "true" : "false"}
              >
                Name
              </Label>
              <Input
                disabled={isLoading}
                id="project-name"
                type="text"
                className="bg-background h-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none focus-visible:border-input aria-invalid:ring-0"
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
              />
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
