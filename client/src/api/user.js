import axios from "axios";

const server = "http://127.0.0.1:5000/user";
const headers =(token="") => ( { Authorization: `Bearer ${token}`,"Content-Type": "application/json" });

export const loginUser = (body) => async (dispatch) => {
  try {
    dispatch({ type: "LOADING" });
    const response = await axios.post(`${server}/login`, body, { headers });
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "LOGIN", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_LOADING" });
    console.error("Login failed:", error);
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};

export const logoutUser = (token) => (dispatch) => {
  dispatch({ type: "LOADING" });

  try {
    axios.post(`${server}/logout`, {}, { headers: headers(token) });
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "CLEAN_UP_EVERTHING" });
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
  } catch (error) {
    dispatch({ type: "STOP_LOADING" });
    console.error("Logout failed:", error);
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};

export const registerUser = (body) => async (dispatch) => {
  try {
    dispatch({ type: "LOADING" });
    const formData = new FormData();
    formData.append("avatar", body.avatar);
    formData.append("email", body.email);
    formData.append("password", body.password);
    formData.append("name", body.name);

    const response = await axios.post(`${server}/register`, formData);
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "LOGIN", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_LOADING" });
    console.error("Registration failed:", error);
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};

export const getProfile = (token) => async (dispatch) => {
  try {
    dispatch({ type: "LOADING" });
    const response = await axios.get(`${server}/`, { headers: { Authorization: `Bearer ${token}` } });
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "GET_PROFILE", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_LOADING" });
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};
export const updateProfile = (token, body) => async (dispatch) => {
  try {
    dispatch({ type: "LOADING" });
    const response = await axios.put(`${server}/`, body, { headers: { Authorization: `Bearer ${token}` } });
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "GET_PROFILE", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_LOADING" });
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};

export const search_users = (token, searchName) => async (dispatch) => {
  try {
    dispatch({ type: "SEARCH_USERS_LOADING" });
    const response = await axios.post(
      `${server}/search`,
      { searchName },
      { headers:  headers(token) }
    );
    dispatch({ type: "STOP_SEARCH_USERS_LOADING" });
    dispatch({ type: "GET_SEARCH_USERS", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_SEARCH_USERS_LOADING" });
    console.error("Search users failed:", error);
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "AUTH_ERROR", payload: errorMsg });
  }
};

