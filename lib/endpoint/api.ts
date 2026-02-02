import { Hydra } from "@/lib/hydra";
import { Endpoint } from "./types";

export const getEndpoints = async (): Promise<Hydra<Endpoint>> => {
  const response = await fetch("/api/endpoints", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch endpoints");
  }

  return response.json();
};
