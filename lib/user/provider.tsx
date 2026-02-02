"use client";

import { useCallback, useEffect, useReducer } from "react";
import { getUser } from "./api";
import { UserContext } from "./context";
import { userReducer } from "./reducer";
import { UserState } from "./types";

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const handleFetchUser = useCallback(async () => {
    try {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      const user = await getUser();
      dispatch({ type: "SET_USER", payload: user });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch user" });
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  }, []);

  const handleClearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  useEffect(() => {
    handleFetchUser();
  }, [handleFetchUser]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        handleFetchUser,
        handleClearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
