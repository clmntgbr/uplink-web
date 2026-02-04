export interface Step {
  id: string;
  position: number;
}

export interface CreateStepPayload {
  position: number;
}

export interface StepState {
  isLoading: boolean;
  error: string | null;
}

export type StepAction = { type: "SET_ERROR"; payload: string } | { type: "SET_LOADING"; payload: boolean };
