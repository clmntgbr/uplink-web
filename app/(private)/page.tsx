"use client";

import { CreateEndpoint } from "@/components/endpoint/create-endpoint";
import { useEndpoint } from "@/lib/endpoint/context";
import { useWorkflow } from "@/lib/workflow/context";

export default function Page() {
  const { endpoints } = useEndpoint();
  const { workflows } = useWorkflow();

  return (
    <>
      <pre>{JSON.stringify(endpoints, null, 2)}</pre>
      <pre>{JSON.stringify(workflows, null, 2)}</pre>
      <CreateEndpoint />
    </>
  );
}
