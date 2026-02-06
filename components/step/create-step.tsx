"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEndpoint } from "@/lib/endpoint/context";
import { Endpoint } from "@/lib/endpoint/types";
import { getMethodColor } from "@/lib/method-color";
import { useStep } from "@/lib/step/context";
import { createStepSchema } from "@/lib/step/schema";
import { Step } from "@/lib/step/types";
import { Workflow } from "@/lib/workflow/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EmptyEndpoint } from "../endpoint/empty-endpoint";
import { JsonEditor } from "../json-editor";
import { Badge } from "../ui/badge";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type StepFormData = z.input<typeof createStepSchema>;

interface KeyValuePair {
  key: string;
  value: string;
}

interface CreateStepDialogProps {
  open?: boolean;
  step?: Step;
  workflow: Workflow;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

const DEFAULT_HEADERS: KeyValuePair[] = [{ key: "Content-Type", value: "application/json" }];

export function CreateStep({ open, step, workflow, onOpenChange, onSuccess }: CreateStepDialogProps) {
  const { createStep } = useStep();
  const { endpoints } = useEndpoint();

  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(step?.endpoint || null);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;

  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [headers, setHeaders] = useState<KeyValuePair[]>([...DEFAULT_HEADERS]);
  const [query, setQuery] = useState<KeyValuePair[]>([]);

  const form = useForm<StepFormData>({
    resolver: zodResolver(createStepSchema),
    defaultValues: {
      name: "",
      body: {},
      query: {},
      header: {},
      response: {},
    },
  });

  const handleSelectedEndpointChange = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    const currentName = form.getValues("name");
    if (!currentName) {
      form.setValue("name", `[${endpoint.method}] ${endpoint.name}`);
    }

    form.setValue("body", endpoint.body || {});
    form.setValue("query", endpoint.query || {});
    form.setValue("header", endpoint.header || {});
    form.setValue("response", endpoint.response || {});
    setHeaders(Object.entries(endpoint.header || {}).map(([key, value]) => ({ key, value: value as string })));
    setQuery(Object.entries(endpoint.query || {}).map(([key, value]) => ({ key, value: value as string })));
  };

  async function onSubmit(data: StepFormData) {
    if (!selectedEndpoint) {
      return;
    }

    await createStep({
      name: data.name,
      endpoint: selectedEndpoint["@id"],
      workflow: workflow["@id"],
      body: data.body,
      query: data.query,
      header: data.header,
      response: data.response,
    });

    setIsOpen(false);
    toast("Step created successfully!", {
      description: "You can now add more steps to your workflow.",
    });

    onSuccess?.();
  }

  function onError() {
    toast("Some fields are invalid", {
      description: "Please check them and try again.",
    });
  }

  const handleCancel = () => {
    setIsOpen(false);
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
            <div key={index} className="flex items-center gap-2">
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
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Plus className="size-4" />
          Add Step
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create Step</DialogTitle>
          <DialogDescription>Configure a new API step to execute.</DialogDescription>
        </DialogHeader>

        <form id="create-endpoint-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <Tabs defaultValue="configuration" className="w-full flex flex-col flex-1 min-h-0 gap-4">
            <TabsList className="w-full shrink-0">
              <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
              <TabsTrigger value="queries">Query</TabsTrigger>
              <TabsTrigger value="headers">Header</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoint" className="mt-0 flex-1 overflow-y-auto">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="step-name">Name</FieldLabel>
                    <Input {...field} id="step-name" placeholder="My API Step" aria-invalid={fieldState.invalid} className="h-9 font-medium" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <ScrollArea className="h-[300px] rounded-md border p-2 my-4">
                <div className="space-y-2">
                  {endpoints.member.map((endpoint: Endpoint) => (
                    <button
                      key={endpoint.id}
                      type="button"
                      onClick={() => handleSelectedEndpointChange(endpoint)}
                      className={`w-full text-left p-3 rounded-md border transition-all ${
                        selectedEndpoint?.id === endpoint.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{endpoint.name}</span>
                        <Badge className={`${getMethodColor(endpoint.method)} text-[10px] px-1.5 py-0`}>{endpoint.method}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono truncate">
                        {endpoint.baseUri}
                        {endpoint.path}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {selectedEndpoint ? (
                <div className="p-3 rounded-md bg-green-500/5 border text-xs space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{selectedEndpoint.name}</span>
                    <Badge className={`${getMethodColor(selectedEndpoint.method)} text-[10px] px-1.5 py-0`}>{selectedEndpoint.method}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {selectedEndpoint.baseUri}
                    {selectedEndpoint.path}
                  </div>
                </div>
              ) : (
                <EmptyEndpoint />
              )}
            </TabsContent>

            <TabsContent value="queries" className="mt-0 flex-1 overflow-y-auto">
              {renderKeyValueFields("Query Parameters", query, setQuery)}
            </TabsContent>

            <TabsContent value="headers" className="mt-0 flex-1 overflow-y-auto">
              {renderKeyValueFields("Header", headers, setHeaders)}
            </TabsContent>

            <TabsContent value="body" className="mt-0 flex-1 overflow-y-auto">
              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-body">Body</FieldLabel>
                    <JsonEditor
                      value={field.value as Record<string, string>}
                      onChange={(jsonString) => {
                        try {
                          const parsed = JSON.parse(jsonString);
                          field.onChange(parsed);
                        } catch {}
                      }}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </TabsContent>
            <TabsContent value="response" className="mt-0 flex-1 overflow-y-auto">
              <Controller
                name="response"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="endpoint-response">Response</FieldLabel>
                    <JsonEditor
                      value={field.value as Record<string, string>}
                      onChange={(jsonString) => {
                        try {
                          const parsed = JSON.parse(jsonString);
                          field.onChange(parsed);
                        } catch {}
                      }}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedEndpoint === null || selectedEndpoint === undefined}>
              Create Step
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
