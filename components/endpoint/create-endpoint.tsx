"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
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
import { HTTP_METHODS } from "next/dist/server/web/http";

type EndpointFormData = z.infer<typeof createEndpointSchema>;

interface KeyValuePair {
  key: string;
  value: string;
}

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

  const [headers, setHeaders] = useState<KeyValuePair[]>([]);

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

  const keyValueToRecord = (pairs: KeyValuePair[]): Record<string, string> => {
    return pairs.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  };

  async function onSubmit(data: EndpointFormData) {
    let bodyObj: Record<string, string> = {};
    if (data.body && data.body.trim()) {
      try {
        bodyObj = JSON.parse(data.body);
      } catch {
        // Already validated by zod
      }
    }

    const payload = {
      name: data.name,
      baseUri: data.baseUri,
      path: data.path,
      method: data.method,
      timeoutSeconds: data.timeoutSeconds,
      header: keyValueToRecord(headers),
      body: bodyObj,
    };

    await createEndpoint(payload);
    setIsOpen(false);
    form.reset();
    setHeaders([]);
  }

  function onError() {}

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
    setHeaders([]);
  };

  const addKeyValue = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>) => {
    setter((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeKeyValue = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateKeyValue = (setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>, index: number, field: "key" | "value", value: string) => {
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const renderKeyValueFields = (label: string, pairs: KeyValuePair[], setter: React.Dispatch<React.SetStateAction<KeyValuePair[]>>) => (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        <Button type="button" size="xs" variant="ghost" onClick={() => addKeyValue(setter)}>
          <Plus className="size-3" />
          Add
        </Button>
      </div>
      {pairs.length > 0 && (
        <div className="space-y-2">
          {pairs.map((pair, index) => (
            <div key={index} className="flex gap-2">
              <Input placeholder="Key" value={pair.key} onChange={(e) => updateKeyValue(setter, index, "key", e.target.value)} className="flex-1" />
              <Input
                placeholder="Value"
                value={pair.value}
                onChange={(e) => updateKeyValue(setter, index, "value", e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="icon-xs" variant="ghost" onClick={() => removeKeyValue(setter, index)}>
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Field>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
          <Plus className="size-4" />
          Create Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {renderKeyValueFields("Headers", headers, setHeaders)}

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
