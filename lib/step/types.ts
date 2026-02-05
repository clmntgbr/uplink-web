import { Endpoint } from "@/lib/endpoint/types";

export interface Step {
  id: string;
  position: number;
  endpoint: Endpoint;
  variables: Record<string, string>;
  asserts: Record<string, string>;
  response: Record<string, unknown>;
}

export interface CreateStepPayload {
  position: number;
}

export interface StepState {
  isLoading: boolean;
  error: string | null;
}

export type StepAction = { type: "SET_ERROR"; payload: string } | { type: "SET_LOADING"; payload: boolean };
