import { Hydra } from "@/lib/hydra";
import { CreateStepPayload, Step } from "./types";

export const getSteps = async (workflowId: string): Promise<Hydra<Step>> => {
  const response = await fetch(`/api/steps?workflow=${workflowId}&itemsPerPage=100`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch steps");
  }

  return response.json();
};

export const postStep = async (payload: CreateStepPayload): Promise<void> => {
  console.log(payload);
  const response = await fetch("/api/steps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create step");
  }
};

export const patchStepPosition = async (stepId: string, position: number): Promise<void> => {
  const response = await fetch(`/api/steps/${stepId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ position }),
  });

  if (!response.ok) {
    throw new Error("Failed to update step position");
  }
};
