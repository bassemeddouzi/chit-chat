import { search_users } from "../api/user";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  search_users: [],
  loading: false,
  error: null,
  search_error: null,
  search_users_loading: false,
  isAuthenticated: !!localStorage.getItem("token"),
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case "GET_PROFILE":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload, error: null };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
        token: null,
        error: null,
        search_users:[],
        search_error:null,
        isAuthenticated: false,
      };

    case "LOADING":
      return { ...state, loading: true, error: null };
    case "STOP_LOADING":
      return { ...state, loading: false, error: null };

    case "AUTH_ERROR":
      return { ...state, error: action.payload };

    case "GET_SEARCH_USERS":
      return { ...state, search_users: action.payload  };
    case "GET_SEARCH_USERS_ERROR":
      return { ...state, search_error: action.payload };
    case "SEARCH_USERS_CLEANUP":
      return { ...state, search_users: [], search_error: null };
    case "SEARCH_USERS_LOADING":
      return { ...state, search_users_loading: true };
    case "STOP_SEARCH_USERS_LOADING":
      return { ...state, search_users_loading: false };
    default:
      return state;
  }
};

export default userReducer;
