import { Hydra } from "@/lib/hydra";

export interface Endpoint {
  id: string;
  name: string;
  baseUri: string;
  path: string;
  method: string;
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
