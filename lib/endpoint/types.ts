import { Hydra } from "@/lib/hydra";

export interface Endpoint {
  id: string;
  name: string;
  baseUri: string;
  path: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  isActive: boolean;
  timeoutSeconds: number;
}

export interface CreateEndpointPayload {
  name: string;
  baseUri: string;
  path: string;
  method: string;
  timeoutSeconds: number;
}

export interface EndpointState {
  endpoints: Hydra<Endpoint>;
  isLoading: boolean;
  error: string | null;
}

export type EndpointAction =
  | { type: "SET_ENDPOINTS"; payload: Hydra<Endpoint> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
