"use client";

import data from "@/components/workflow/data.json";
import { WorkflowTitle } from "@/components/workflow/title";
import { DataTable } from "@/components/workflow/workflow-table";

export default function Page() {
  return (
    <>
      <WorkflowTitle />
      <DataTable data={data} />
    </>
  );
}
