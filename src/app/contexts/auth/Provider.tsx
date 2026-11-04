// Import Dependencies
import { useEffect, useReducer, ReactNode } from "react";

// Local Imports
import axios from "@/utils/axios";
import { isTokenValid, setSession, storage } from "@/utils/jwt";
import { AuthProvider as AuthContext, AuthContextType } from "./context";
import { User } from "@/@types/user";

// ----------------------------------------------------------------------

interface AuthAction {
  type:
    | "INITIALIZE"
    | "LOGIN_REQUEST"
    | "LOGIN_SUCCESS"
    | "LOGIN_ERROR"
    | "LOGOUT";
  payload?: Partial<AuthContextType>;
}

// Initial state
const initialState: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  login: async () => false,
  logout: async () => {},
};

// Reducer handlers
const reducerHandlers: Record<
  AuthAction["type"],
  (state: AuthContextType, action: AuthAction) => AuthContextType
> = {
  INITIALIZE: (state, action) => ({
    ...state,
    isAuthenticated: action.payload?.isAuthenticated ?? false,
    isInitialized: true,
    user: action.payload?.user ?? null,
  }),

  // Clear the previous error as soon as a new login attempt starts
  LOGIN_REQUEST: (state) => ({
    ...state,
    isLoading: true,
    errorMessage: null,
  }),

  LOGIN_SUCCESS: (state, action) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    errorMessage: null,
    user: action.payload?.user ?? null,
  }),

  LOGIN_ERROR: (state, action) => ({
    ...state,
    errorMessage: action.payload?.errorMessage ?? "An error occurred",
    isLoading: false,
  }),

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    errorMessage: null,
    user: null,
  }),
};

// Reducer function
const reducer = (
  state: AuthContextType,
  action: AuthAction,
): AuthContextType => {
  const handler = reducerHandlers[action.type];
  return handler ? handler(state, action) : state;
};

// Removes the old token / company data so a stale session does not break login
const clearStaleSession = () => {
  setSession(null);
  localStorage.removeItem("companyId");
  localStorage.removeItem("financialYearId");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = storage.getItem("authToken");

        if (authToken && isTokenValid(authToken)) {
          setSession(authToken);

          // const response = await axios.get<{ user: User }>("/user/profile");
          // const { user } = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: null,
            },
          });
        } else {
          // Token is missing or expired => remove it from storage as well
          if (authToken) setSession(null);

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        setSession(null);

        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    init();
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    // Prevent double click / double submit
    if (state.isLoading) return false;

    dispatch({ type: "LOGIN_REQUEST" });

    // Remove the old token from headers before the login request,
    // otherwise the backend / interceptor may return 401 for the old token
    clearStaleSession();

    const payload = {
      email: credentials.email.trim(),
      password: credentials.password,
    };

    const request = () =>
      axios.post<{
        token: string;
        user: User;
      }>("/auth/login", payload);

    try {
      let response;

      try {
        response = await request();
      } catch (firstErr: any) {
        // No response received from the server (network drop / slow server):
        // retry once automatically. Errors like wrong password are not retried.
        if (!firstErr?.response) {
          response = await request();
        } else {
          throw firstErr;
        }
      }

      const { token, user } = response.data;

      setSession(token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user },
      });

      return true;
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      const msg = err?.response
        ? err.response.data?.message || "Login failed. Please try again."
        : "Unable to connect to the server. Please try again.";

      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: msg,
        },
      });

      return false;
    }
  };

  const logout = async () => {
    clearStaleSession();

    dispatch({ type: "LOGOUT" });
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}