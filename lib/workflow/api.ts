import { Hydra } from "@/lib/hydra";
import { Workflow } from "./types";

export const getWorkflows = async (): Promise<Hydra<Workflow>> => {
  const response = await fetch("/api/workflows", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workflows");
  }

  return response.json();
};

export const getWorkflow = async (id: string): Promise<Workflow> => {
  const response = await fetch(`/api/workflows/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }

  return response.json();
};
