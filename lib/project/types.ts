import { Hydra } from "@/lib/hydra";

export interface Project {
  id: string;
  isActive: boolean;
  name: string;
}

export interface ProjectState {
  projects: Hydra<Project>;
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

export type ProjectAction =
  | { type: "SET_PROJECTS"; payload: Hydra<Project>; project: Project | null }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };
