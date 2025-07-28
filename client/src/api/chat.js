import axios from "axios";
import socket from "../socket/socketIO";
const server = "http://127.0.0.1:5000";

export const getConversation = (token) => async (dispatch) => {
  dispatch({ type: "GET_CONVERSATION_LOADIONG" });
  try {
    const response = await axios.get(`${server}/conversation/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "STOP_GET_CONVERSATION_LOADIONG" });
    dispatch({ type: "GET_CONVERSATIONS", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_GET_CONVERSATION_LOADIONG" });
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "GET_CONVERSATION_ERROR", payload: errorMsg });
  }
};
export const startConversation = (token, email) => async (dispatch) => {
  dispatch({ type: "ADD_CONVERSATION_LOADING" });
  try {
    const response = await axios.post(
      `${server}/conversation/add`,
      { participantsEmail: email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch({ type: "STOP_ADD_CONVERSATION_LOADING" });
    dispatch({ type: "ADD_CONVERSATION", payload: response.data });
    dispatch({ type: "OPEN_CONVERSATION", payload: response.data });
  } catch (error) {
    dispatch({ type: "STOP_ADD_CONVERSATION_LOADING" });
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({ type: "ADD_CONVERSATION_ERROR", payload: errorMsg });
  }
};

export const getMessages =
  (token, id, page = 1) =>
  async (dispatch) => {
    dispatch({ type: "GET_OPENED_MESSAGES_LOADING" });
    try {
      const response = await axios.get(`${server}/message/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page },
      });
      dispatch({ type: "GET_OPENED_MESSAGES_STOP_LOADING" });
      dispatch({
        type: "GET_OPENED_MESSAGES",
        payload: response.data.messages,
      });
    } catch (error) {
      dispatch({ type: "GET_OPENED_MESSAGES_STOP_LOADING" });
      let errorMsg =
        error.response?.data?.error || error?.message || error.response;
      if (error.status === 500)
        errorMsg = "there's a problem with the server, please try again later";
      dispatch({ type: "GET_OPENED_MESSAGES_ERROR", payload: errorMsg });
    }
  };
export const sendFile = (token, message) => async (dispatch) => {
  dispatch({ type: "SEND_FILE_LOADING" });
  const formData = new FormData();
  formData.append("conversationId", message.conversation);
  formData.append("senderId", message.senderId._id);
  formData.append("file", message.content);
  formData.append("type", message.type);
  try {
    const response = await axios.post(`${server}/message/`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "SEND_FILE_LOADING_STOP" });
    const { conversation, senderId, read, timestamp, type, to_user } = message;
    socket.emit("sendMessage", {
      newMessage: {
        conversation,
        senderId,
        content: response.data,
        read,
        timestamp,
        type,
        to_user,
      },
      to_user,
    });
    return response.data;
  } catch (error) {
    dispatch({ type: "SEND_FILE_LOADING_STOP" });
    let errorMsg =
      error.response?.data?.error || error?.message || error.response;
    if (error.status === 500)
      errorMsg = "there's a problem with the server, please try again later";
    dispatch({
      type: "SEND_FILE_ERROR",
      payload: errorMsg,
    });
  }
};
