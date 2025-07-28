import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import socket from "../socket/socketIO";

function OutCallAlert() {
  const dispatch = useDispatch();
  const ongoingCall = useSelector((state) => state.call.outgoingCall);

  if (!ongoingCall) return null;

  const { type, to_user, socketId } = ongoingCall;

  const handleCancel = () => {
    socket.emit("endCall", { toSocketId: socketId });
    dispatch({ type: "END_CALL" });
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-4 z-50 w-[90%] max-w-sm border border-gray-200 animate-slide-in">
      <div className="flex items-center gap-4">
        <img
          src="/default-avatar.png"
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold">Calling...</p>
          <p className="text-sm text-gray-500">Waiting for response</p>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            onClick={handleCancel}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OutCallAlert;
