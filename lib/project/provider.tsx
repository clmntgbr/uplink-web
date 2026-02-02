"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getProjects } from "./api";
import { ProjectContext } from "./context";
import { projectReducer } from "./reducer";
import { ProjectState } from "./types";

const initialState: ProjectState = {
  projects: {
    member: [],
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 0,
    totalItems: 0,
  },
  project: null,
  isLoading: false,
  error: null,
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        fetchProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
