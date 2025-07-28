import React from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import socket from "../../socket/socketIO";

function VoiceRoom({ toSocketId }) {
  const dispatch = useDispatch();

  const handleEndCall = () => {
    socket.emit("endCall", { toSocketId });
    dispatch({ type: "END_CALL" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 text-white">
      <p className="text-xl mb-6">Voice Call...</p>
      <button
        className="p-4 bg-red-600 rounded-full hover:bg-red-700"
        onClick={handleEndCall}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

export default VoiceRoom;
