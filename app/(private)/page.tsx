"use client";

import { CreateEndpoint } from "@/components/endpoint/create-endpoint";
import { useEndpoint } from "@/lib/endpoint/context";

export default function Page() {
  const { endpoints } = useEndpoint();
  return (
    <>
      <CreateEndpoint />
    </>
  );
}
