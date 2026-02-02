"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEndpoint } from "@/lib/endpoint/context";
import { createEndpointSchema } from "@/lib/endpoint/schema";
import { CreateEndpointPayload } from "@/lib/endpoint/types";
import { HTTP_METHODS } from "next/dist/server/web/http";

type EndpointFormData = z.infer<typeof createEndpointSchema>;

interface CreateEndpointDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateEndpoint({ open, onOpenChange }: CreateEndpointDialogProps) {
  const { createEndpoint } = useEndpoint();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<EndpointFormData>({
    resolver: zodResolver(createEndpointSchema),
    defaultValues: {
      name: "",
      baseUri: "",
      path: "",
      method: "GET",
      timeoutSeconds: 30,
      body: "",
    },
  });

  async function onSubmit(payload: CreateEndpointPayload) {
    const endpoint = {
      ...payload,
    };

    await createEndpoint(endpoint);
    setIsOpen(false);
    form.reset();
  }

  function onError() {}

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
          <Plus className="size-4" />
          Create Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Endpoint</DialogTitle>
          <DialogDescription>Configure a new API endpoint to monitor.</DialogDescription>
        </DialogHeader>

        <form id="create-endpoint-form" onSubmit={form.handleSubmit(onSubmit, onError)}>
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

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="baseUri"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-baseUri">Base URI</FieldLabel>
                    <Input {...field} id="endpoint-baseUri" placeholder="https://api.example.com" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="path"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-path">Path</FieldLabel>
                    <Input {...field} id="endpoint-path" placeholder="/api/v1/users" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="method"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-method">Method</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="endpoint-method" className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {HTTP_METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="timeoutSeconds"
                control={form.control}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-timeout">Timeout (seconds)</FieldLabel>
                    <Input
                      {...field}
                      id="endpoint-timeout"
                      type="number"
                      placeholder="30"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => onChange(e.target.valueAsNumber)}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="body"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="endpoint-body">Body (JSON)</FieldLabel>
                  <Textarea
                    {...field}
                    id="endpoint-body"
                    placeholder='{"key": "value"}'
                    className="font-mono text-xs min-h-[120px]"
                    aria-invalid={fieldState.invalid}
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
            <Button type="submit">Create Endpoint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
