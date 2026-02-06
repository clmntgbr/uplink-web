import { Hydra } from "@/lib/hydra";
import { JsonObject } from "../json";

export interface Endpoint {
  "@id": string;
  id: string;
  name: string;
  baseUri: string;
  path: string;
  method: string;
  header: Record<string, string>;
  body: JsonObject;
  query: Record<string, string>;
  timeoutSeconds: number;
}

export interface CreateEndpointPayload {
  name: string;
  baseUri: string;
  path: string;
  method: string;
  header: Record<string, string>;
  body: JsonObject;
  query: Record<string, string>;
  timeoutSeconds: number;
}

export interface EndpointState {
  endpoints: Hydra<Endpoint>;
  isLoading: boolean;
  error: string | null;
}

export const HttpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export type EndpointAction =
  | { type: "SET_ENDPOINTS"; payload: Hydra<Endpoint> }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
