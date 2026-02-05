"use client";

import { CreateWorkflow } from "@/components/workflow/create-workflow";
import { WorkflowTitle } from "@/components/workflow/title";
import { WorkflowTable } from "@/components/workflow/workflow-table";

export default function Page() {
  return (
    <>
      <div className="flex justify-between items-center">
        <WorkflowTitle />
        <CreateWorkflow />
      </div>
      <WorkflowTable />
    </>
  );
}
