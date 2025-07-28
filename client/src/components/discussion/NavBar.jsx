import React from "react";
import { Phone, Video } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../../socket/socketIO";
function NavBarDiscussion() {
  const myProfile = useSelector((state) => state.user.user);
  const conversation = useSelector((state) => state.chat.openedConversation);
  const otherParticipant =
    conversation.participant1._id === myProfile._id
      ? conversation.participant2
      : conversation.participant1;
  const requestCall = (type) => {
    if (!otherParticipant) {
      return;
    }
    socket.emit("getSocketID", {
      type,
      from_user: myProfile._id,
      to_user: otherParticipant._id,
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-900 text-white">
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-lg">
          {otherParticipant?.name || "Conversation"}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button className="flex items-center px-3 py-2 hover:bg-gray-500 w-full">
          <Phone className="w-4 h-4 mr-2" onClick={() => requestCall("voice")} />
        </button>
        <button className="flex items-center px-3 py-2 hover:bg-gray-500 w-full">
          <Video className="w-4 h-4 mr-2" onClick={() => requestCall("video")}/>
        </button>
      </div>
    </div>
  );
}

export default NavBarDiscussion;
