"use client";

import { InputWithLabel } from "@/components/input-with-label";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useEndpoint } from "@/lib/endpoint/context";
import { createEndpointSchema } from "@/lib/endpoint/schema";
import { HttpMethods } from "@/lib/endpoint/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SelectWithLabel } from "../select-with-label";

export function CreateEndpoint() {
  const { createEndpoint } = useEndpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof createEndpointSchema>>({
    resolver: zodResolver(createEndpointSchema),
    defaultValues: {
      name: "",
      baseUri: "",
      path: "",
      method: "",
      timeoutSeconds: 30,
      body: {},
      query: {},
      header: {},
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  const onSubmit = async (data: z.infer<typeof createEndpointSchema>) => {
    setIsLoading(true);
    console.log(data);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus />
          <span>Create Endpoint</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl py-8">
          <DrawerHeader className="items-center">
            <DrawerTitle className="scroll-m-20 text-balance text-center text-3xl font-extrabold tracking-tight max-w-xl">
              Create a new endpoint and connect it to a workflow
            </DrawerTitle>
          </DrawerHeader>
          <form id="create-endpoint-form" className="p-4 pb-0 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <InputWithLabel label="Name" disabled={isLoading} error={errors.name?.message} {...register("name")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputWithLabel label="Base URI" disabled={isLoading} error={errors.baseUri?.message} {...register("baseUri")} />
              <InputWithLabel label="Path" disabled={isLoading} error={errors.path?.message} {...register("path")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <SelectWithLabel
                    label="Method"
                    disabled={isLoading}
                    error={errors.method?.message}
                    options={HttpMethods.map((method) => ({ label: method, value: method }))}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
              <InputWithLabel
                label="Timeout"
                disabled={isLoading}
                error={errors.timeoutSeconds?.message}
                addon="seconds"
                type="number"
                {...register("timeoutSeconds", { valueAsNumber: true })}
              />
            </div>
          </form>
          <DrawerFooter>
            <div className="flex w-full items-center justify-end space-x-2">
              <DrawerClose asChild>
                <Button variant="outline" type="button" onClick={() => reset()} disabled={isLoading}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" form="create-endpoint-form" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                Submit {isLoading && <Spinner />}
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
