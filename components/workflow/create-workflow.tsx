"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useWorkflow } from "@/lib/workflow/context";
import { createWorkflowSchema } from "@/lib/workflow/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Textarea } from "../ui/textarea";

type WorkflowFormData = z.input<typeof createWorkflowSchema>;

interface CreateWorkflowDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkflow({ open, onOpenChange }: CreateWorkflowDialogProps) {
  const { createWorkflow } = useWorkflow();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;

  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: WorkflowFormData) {
    await createWorkflow({
      name: data.name,
      description: data.description || undefined,
    });
    toast.success("Workflow created successfully");
    setIsOpen(false);
    form.reset();
  }

  function onError() {
    toast("Some fields are invalid", {
      description: "Please check them and try again.",
      closeButton: false,
      style: {
        "--normal-bg": "light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))",
        "--normal-text": "var(--color-white)",
        "--normal-border": "transparent",
      } as React.CSSProperties,
    });
  }

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} size="lg">
          <Plus className="size-4" />
          Create Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Workflow</DialogTitle>
          <DialogDescription>Configure a new API workflow to monitor.</DialogDescription>
        </DialogHeader>

        <form id="create-endpoint-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="endpoint-name">Name</FieldLabel>
                  <Input {...field} id="endpoint-name" placeholder="My API Endpoint" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="endpoint-description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="endpoint-description"
                    placeholder="My API Workflow"
                    aria-invalid={fieldState.invalid}
                    value={field.value || ""}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Workflow</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
