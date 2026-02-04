"use client";

import { useCallback, useEffect, useReducer } from "react";
import { initHydra } from "../hydra";
import { getProjects, postProject, putProject } from "./api";
import { ProjectContext } from "./context";
import { ProjectReducer } from "./reducer";
import { CreateProjectPayload, Project, ProjectState, UpdateProjectPayload } from "./types";

const initialState: ProjectState = {
  projects: initHydra<Project>(),
  project: null,
  isLoading: false,
  error: null,
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ProjectReducer, initialState);

  const fetchProjects = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const projects = await getProjects();
      dispatch({ type: "SET_PROJECTS", payload: projects, project: projects.member.find((project) => project.isActive) ?? null });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch projects" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createProject = useCallback(
    async (payload: CreateProjectPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await postProject(payload);
        await fetchProjects();
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to create project" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [fetchProjects]
  );

  const updateProject = useCallback(
    async (payload: UpdateProjectPayload) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await putProject(payload);
        await fetchProjects();
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to update project" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [fetchProjects]
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        fetchProjects,
        createProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
