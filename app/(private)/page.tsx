"use client";

import { CreateEndpoint } from "@/components/endpoint/create-endpoint";
import { CreateWorkflow } from "@/components/workflow/create-workflow";
import { WorkflowTable } from "@/components/workflow/workflow-table";

export default function Page() {
  return (
    <>
      <div className="flex justify-between container max-w-7xl px-4 mx-auto flex-col">
        <div className="flex justify-between gap-4">
          <h1 className="scroll-m-20 flex-1 text-balance text-4xl font-extrabold tracking-tight">Workflow builder</h1>
          <CreateWorkflow />
          <CreateEndpoint />
        </div>
        <WorkflowTable />
      </div>
    </>
  );
}
