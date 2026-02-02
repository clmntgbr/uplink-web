"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getEndpoints } from "./api";
import { EndpointContext } from "./context";
import { EndpointReducer } from "./reducer";
import { EndpointState } from "./types";

const initialState: EndpointState = {
  endpoints: {
    member: [],
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 0,
    totalItems: 0,
  },
  isLoading: false,
  error: null,
};

export function EndpointProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(EndpointReducer, initialState);

  const fetchEndpoints = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const endpoints = await getEndpoints();
      dispatch({ type: "SET_ENDPOINTS", payload: endpoints });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch endpoints" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  return (
    <EndpointContext.Provider
      value={{
        ...state,
        fetchEndpoints,
      }}
    >
      {children}
    </EndpointContext.Provider>
  );
}
