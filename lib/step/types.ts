import { Endpoint } from "@/lib/endpoint/types";

export interface Step {
  id: string;
  position: number;
  endpoint: Endpoint;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<string, unknown>;
}

export interface CreateStepPayload {
  name: string;
  endpoint: string;
  workflow: string;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  header: Record<string, unknown>;
  response: Record<string, unknown>;
}

export interface StepState {
  isLoading: boolean;
  error: string | null;
}

export type StepAction = { type: "SET_ERROR"; payload: string } | { type: "SET_LOADING"; payload: boolean };
