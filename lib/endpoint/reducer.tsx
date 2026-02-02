import { EndpointAction, EndpointState } from "./types";

export const EndpointReducer = (state: EndpointState, action: EndpointAction): EndpointState => {
  switch (action.type) {
    case "SET_ENDPOINTS":
      return {
        ...state,
        endpoints: action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        endpoints: {
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
