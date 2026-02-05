import { Hydra } from "@/lib/hydra";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
}

export interface CreateWorkflowPayload {
  name: string;
  description?: string;
}

export interface WorkflowState {
  workflows: Hydra<Workflow>;
  isLoading: boolean;
  error: string | null;
}

export type WorkflowAction =
  | { type: "SET_WORKFLOWS"; payload: Hydra<Workflow> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
