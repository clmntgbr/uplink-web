"use client";

import { useEndpoint } from "@/lib/endpoint/context";
import { useProject } from "@/lib/project/context";
import { useUser } from "@/lib/user/context";
import { useWorkflow } from "@/lib/workflow/context";

export default function Page() {
  const { user } = useUser();
  const { projects, project } = useProject();
  const { endpoints } = useEndpoint();
  const { workflows } = useWorkflow();

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
      <pre>{JSON.stringify(project, null, 2)}</pre>
      <pre>{JSON.stringify(endpoints, null, 2)}</pre>
      <pre>{JSON.stringify(workflows, null, 2)}</pre>
    </>
  );
}
