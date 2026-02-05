import { Hydra } from "@/lib/hydra";
import { CreateProjectPayload, Project, UpdateProjectPayload } from "./types";

export const getProjects = async (): Promise<Hydra<Project>> => {
  const response = await fetch("/api/projects", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
};

export const postProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
};

export const putProject = async (payload: UpdateProjectPayload): Promise<Project> => {
  const response = await fetch(`/api/projects/${payload.id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
};
