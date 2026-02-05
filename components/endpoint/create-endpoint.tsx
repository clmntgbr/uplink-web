"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEndpoint } from "@/lib/endpoint/context";
import { createEndpointSchema } from "@/lib/endpoint/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { HTTP_METHODS } from "next/dist/server/web/http";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { JsonEditor } from "../json-editor";

type EndpointFormData = z.input<typeof createEndpointSchema>;

interface KeyValuePair {
  key: string;
  value: string;
}

interface CreateEndpointDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_HEADERS: KeyValuePair[] = [{ key: "Content-Type", value: "application/json" }];

export function CreateEndpoint({ open, onOpenChange }: CreateEndpointDialogProps) {
  const { createEndpoint } = useEndpoint();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [headers, setHeaders] = useState<KeyValuePair[]>([...DEFAULT_HEADERS]);
  const [query, setQuery] = useState<KeyValuePair[]>([]);

  const form = useForm<EndpointFormData>({
    resolver: zodResolver(createEndpointSchema),
    defaultValues: {
      name: "",
      baseUri: "",
      path: "",
      method: "GET",
      timeoutSeconds: 30,
      body: {},
      response: {},
    },
  });

  const keyValueToRecord = (pairs: KeyValuePair[]): Record<string, string> => {
    return pairs.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  };

  async function onSubmit(data: EndpointFormData) {
    const payload = {
      name: data.name,
      baseUri: data.baseUri,
      path: data.path,
      method: data.method,
      timeoutSeconds: data.timeoutSeconds,
      header: keyValueToRecord(headers),
      query: keyValueToRecord(query),
      body: data.body || {},
      response: data.response || {},
    };

    await createEndpoint(payload);
    setIsOpen(false);
    form.reset();
    setHeaders([...DEFAULT_HEADERS]);
    setQuery([]);
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
    setHeaders([...DEFAULT_HEADERS]);
    setQuery([]);
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

  const parseQueryString = (queryString: string): KeyValuePair[] => {
    const params: KeyValuePair[] = [];
    if (queryString) {
      const pairs = queryString.split("&");
      for (const pair of pairs) {
        const [key, value = ""] = pair.split("=");
        if (key) {
          params.push({ key: decodeURIComponent(key), value: decodeURIComponent(value) });
        }
      }
    }
    return params;
  };

  const addQueryParams = (params: KeyValuePair[]) => {
    if (params.length > 0) {
      setQuery((prev) => {
        const existingKeys = new Set(prev.map((p) => p.key));
        const newParams = params.filter((p) => !existingKeys.has(p.key));
        return [...prev, ...newParams];
      });
    }
  };

  const parseUrl = (url: string): { baseUri: string; path: string; params: KeyValuePair[] } => {
    const templateMatch = url.match(/^(\{\{[^}]+\}\})(.*)/);
    if (templateMatch) {
      const [, template, rest] = templateMatch;
      const { path, params } = parsePathAndQuery(rest);
      return { baseUri: template, path, params };
    }

    try {
      const parsed = new URL(url);
      const baseUri = `${parsed.protocol}//${parsed.host}`;
      const path = parsed.pathname || "/";
      const params = parseQueryString(parsed.search.substring(1));
      return { baseUri, path, params };
    } catch {
      return { baseUri: url, path: "", params: [] };
    }
  };

  const parsePathAndQuery = (pathWithQuery: string): { path: string; params: KeyValuePair[] } => {
    const queryIndex = pathWithQuery.indexOf("?");
    if (queryIndex === -1) {
      return { path: pathWithQuery || "/", params: [] };
    }
    const path = pathWithQuery.substring(0, queryIndex) || "/";
    const params = parseQueryString(pathWithQuery.substring(queryIndex + 1));
    return { path, params };
  };

  const handleBaseUriChange = (value: string, onChange: (value: string) => void) => {
    const { baseUri, path, params } = parseUrl(value);

    if (path && path !== "/") {
      const currentPath = form.getValues("path");
      if (!currentPath || currentPath === "/") {
        form.setValue("path", path);
      }
    }

    addQueryParams(params);
    onChange(baseUri);
  };

  const handlePathChange = (value: string, onChange: (value: string) => void) => {
    const { path, params } = parsePathAndQuery(value);
    addQueryParams(params);
    onChange(params.length > 0 ? path : value);
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
        <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
          <Plus className="size-4" />
          Create Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl min-h-[450px] max-h-[90vh] flex flex-col overflow-hidden min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Endpoint</DialogTitle>
          <DialogDescription>Configure a new API endpoint to monitor.</DialogDescription>
        </DialogHeader>

        <form id="create-endpoint-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col flex-1 min-h-0">
          <Tabs defaultValue="configuration" className="w-full flex flex-col flex-1 min-h-0 gap-4">
            <TabsList className="w-full shrink-0">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="queries">Query</TabsTrigger>
              <TabsTrigger value="headers">Header</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="mt-0 flex-1 overflow-y-auto">
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
                    render={({ field: { onChange, ...field }, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="endpoint-baseUri">Base URI</FieldLabel>
                        <Input
                          {...field}
                          id="endpoint-baseUri"
                          placeholder="https://api.example.com"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => handleBaseUriChange(e.target.value, onChange)}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="path"
                    control={form.control}
                    render={({ field: { onChange, ...field }, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="endpoint-path">Path</FieldLabel>
                        <Input
                          {...field}
                          id="endpoint-path"
                          placeholder="/api/v1/users?page=1"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => handlePathChange(e.target.value, onChange)}
                        />
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
              </FieldGroup>
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
            <Button type="submit">Create Endpoint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
