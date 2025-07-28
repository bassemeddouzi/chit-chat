import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Phone, Video, X } from "lucide-react";
import socket from "../socket/socketIO";
import { handleIncomingOffer } from "../socket/CallSocketHandler";

function InCallAlert() {
  const dispatch = useDispatch();
  const incomingCall = useSelector((state) => state.call.incomingCall);

  if (!incomingCall) return null;

  const { type, socketId, from_user } = incomingCall;

  const handleReject = () => {
    socket.emit("rejectCall", { toSocketId: socketId });
    dispatch({ type: "REJECT_CALL" });
  };

  const handleAccept = () => {
    socket.emit("acceptCall", {
      toSocketId: socketId,
      peerOffer: {},
    });
    handleIncomingOffer({
    from: incomingCall.socketId,
    offer: incomingCall.offer,
    type: type,
    dispatch,
  });
    dispatch({
      type: "ACCEPT_CALL",
      payload: { type, socketId, from_user },
    });
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-4 z-50 w-[90%] max-w-sm border border-gray-200 animate-slide-in">
      <div className="flex items-center gap-4">
        <img
          src={"/default-avatar.png"}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold">New Call</p>
          <p className="text-sm text-gray-500">is calling you...</p>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            onClick={handleReject}
          >
            <X className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            onClick={handleAccept}
          >
            {type === "video" ? (
              <Video className="w-5 h-5" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InCallAlert;
