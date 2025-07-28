import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  handleIncomingOffer,
  handleAnswer,
  handleIceCandidate,
  startCall,
} from "../socket/CallSocketHandler";

export const SocketHandler = ({ socket }) => {
  const dispatch = useDispatch();
  const openedConversation = useSelector(
    (state) => state.chat.openedConversation
  );
  const conversations = useSelector((state) => state.chat.conversations);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: newMessage,
      });
      if (openedConversation?._id === newMessage.conversation) {
        dispatch({
          type: "ADD_MESSAGE_OPENED_CONVERSATION",
          payload: newMessage,
        });
      }
    });
    socket.on("getSocketID", ({ socketId, type, from_user, to_user }) => {
      dispatch({
        type: "RECEIVED_SOCKET_ID",
        payload: { socketId, type, from_user, to_user },
      });
      startCall({
        toSocketId: socketId,
        callType: type,
        dispatch,
      });
    });
    socket.on("rejectCall", () => {
      dispatch({
        type: "CALL_REJECTED",
        payload: { reason: "Rejected by user" },
      });
    });
    socket.on("acceptCall", ({ peerOffer }) => {
      dispatch({ type: "CALL_ACCEPTED", payload: peerOffer });
    });
    socket.on("endCall", () => {
      dispatch({ type: "CALL_ENDED" });
    });
    socket.on("receiveCall", ({ from_user, socketId, type }) => {
      dispatch({
        type: "INCOMING_CALL",
        payload: { from_user, socketId, type },
      });
    });
    socket.on("sendOffer", (data) => {
      handleIncomingOffer({ ...data, dispatch });
    });

    socket.on("sendAnswer", ({ answer }) => {
      handleAnswer(answer);
    });

    socket.on("iceCandidate", ({ candidate }) => {
      handleIceCandidate(candidate);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("getSocketID");
      socket.off("receiveCall");
      socket.off("acceptCall");
      socket.off("rejectCall");
      socket.off("endCall");
    };
  }, [dispatch, openedConversation]);

  return;
};
