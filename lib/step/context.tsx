"use client";

import { createContext, useContext } from "react";
import { Hydra } from "../hydra";
import { CreateStepPayload, Step, StepState } from "./types";

export interface StepContextType extends StepState {
  fetchSteps: (workflowId: string) => Promise<Hydra<Step>>;
  createStep: (payload: CreateStepPayload) => Promise<void>;
  updateStepPosition: (stepId: string, position: number, workflowId: string) => Promise<void>;
}

export const StepContext = createContext<StepContextType | undefined>(undefined);

export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useStep must be used within StepProvider");
  }
  return context;
};
