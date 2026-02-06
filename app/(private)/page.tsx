"use client";

import { CreateWorkflow } from "@/components/workflow/create-workflow";

export default function Page() {
  return (
    <>
      <div className="flex justify-between items-center container max-w-7xl px-4 mx-auto">
        <CreateWorkflow />
      </div>
    </>
  );
}
