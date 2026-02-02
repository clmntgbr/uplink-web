import { Hydra } from "@/lib/hydra";
import { Project } from "./types";

export const getProjects = async (): Promise<Hydra<Project>> => {
  const response = await fetch("/api/projects", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};
