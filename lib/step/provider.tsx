"use client";

import { useCallback, useReducer } from "react";
import { Hydra } from "../hydra";
import { getSteps, postStep } from "./api";
import { StepContext } from "./context";
import { StepReducer } from "./reducer";
import { CreateStepPayload, Step, StepState } from "./types";

const initialState: StepState = {
  isLoading: false,
  error: null,
};

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(StepReducer, initialState);

  const fetchSteps = useCallback(async (workflowId: string): Promise<Hydra<Step>> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const steps = await getSteps(workflowId);
      return steps;
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch steps" });
      throw new Error("Failed to fetch steps");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createStep = useCallback(
    async (payload: CreateStepPayload, workflowId: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await postStep(payload);
        await fetchSteps(workflowId);
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to create step" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [fetchSteps]
  );

  return (
    <StepContext.Provider
      value={{
        ...state,
        fetchSteps,
        createStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}
