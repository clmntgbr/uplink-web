import { ProjectAction, ProjectState } from "./types";

export const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        project: action.project,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        projects: {
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
