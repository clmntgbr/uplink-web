"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useProject } from "../project/context";
import { getWorkflows } from "./api";
import { WorkflowContext } from "./context";
import { WorkflowReducer } from "./reducer";
import { WorkflowState } from "./types";

const initialState: WorkflowState = {
  workflows: {
    member: [],
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 0,
    totalItems: 0,
  },
  isLoading: false,
  error: null,
};

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(WorkflowReducer, initialState);
  const { project } = useProject();

  const fetchWorkflows = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const workflows = await getWorkflows();
      dispatch({ type: "SET_WORKFLOWS", payload: workflows });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch workflows" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Re-fetch workflows when the active project changes
  useEffect(() => {
    if (project?.id) {
      fetchWorkflows();
    }
  }, [fetchWorkflows, project?.id]);

  return (
    <WorkflowContext.Provider
      value={{
        ...state,
        fetchWorkflows,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
