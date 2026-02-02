import { WorkflowAction, WorkflowState } from "./types";

export const WorkflowReducer = (state: WorkflowState, action: WorkflowAction): WorkflowState => {
  switch (action.type) {
    case "SET_WORKFLOWS":
      return {
        ...state,
        workflows: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        workflows: {
          member: [],
          currentPage: 0,
          itemsPerPage: 0,
          totalPages: 0,
          totalItems: 0,
        },
        isLoading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
