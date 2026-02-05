"use client";

import { createContext, useContext } from "react";
import { Workflow, WorkflowState } from "./types";

export interface WorkflowContextType extends WorkflowState {
  fetchWorkflows: () => Promise<void>;
  fetchWorkflow: (id: string) => Promise<Workflow>;
}

export const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return context;
};
