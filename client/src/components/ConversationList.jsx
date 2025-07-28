import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../api/chat";
import defaultAvatar from "../assets/avatar.png";
import { Loader } from "lucide-react";
import { isBeen } from "../utils";
import LongWord from "./Tools/LongWord";
function ListeConverstaion() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const conversations = useSelector((state) => state.chat.conversations);
  const user = useSelector((state) => state.user.user);
  // const get_loading = useSelector(
  //   (state) => state.chat.get_converstations_loading
  // );
  // const get_error = useSelector((state) => state.chat.get_conversation_error);
  const add_loading = useSelector((state) => state.chat.add_conv_loading);
  // const add_error = useSelector((state) => state.chat.error_add_conv);
  const openConversation = useSelector(
    (state) => state.chat.openedConversation
  );
  useEffect(() => {}, [conversations]);
  useEffect(() => {
    dispatch(getConversation(token));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto ">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Conversations
        </h2>
        <ul className="space-y-3">
          {add_loading && (
            <li className="flex items-center border border-gray-200 rounded-lg px-4 py-3 transition">
              <div className="flex w-full h-10 rounded-full object-cover items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            </li>
          )}

          {conversations
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((conv) => {
              const participant =
                conv.participant1._id === user._id
                  ? conv.participant2
                  : conv.participant1;
              const avatarUrl = participant?.avatar
                ? `http://localhost:5000/media/avatars/${participant.avatar}`
                : defaultAvatar;

              return (
                <li
                  key={conv._id}
                  onClick={() => {
                    dispatch({ type: "OPEN_CONVERSATION", payload: conv });
                  }}
                  style={{
                    backgroundColor:
                      conv._id === openConversation?._id
                        ? "#E5E7EB"
                        : "transparent",
                  }}
                  className="flex items-center border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="mr-4 relative">
                    <img
                      src={avatarUrl}
                      alt={participant?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0  right-0 w-3 h-3 rounded-full border-2 border-white ${
                        participant?.status?.connected
                          ? "bg-green-500"
                          : "bg-gray-600 px-1 h-max w-max text-[8px] text-gray-300"
                      }`}
                    >
                      {!participant?.status?.connected &&
                        isBeen(participant?.status?.lastConnected)}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-900">{participant?.name}
                    </div>
                    <div
                      className={
                        "text-sm text-gray-600  truncate" +
                        (conv?.lastMessage?.read ? "" : " font-bold")
                      }
                    >
                      {conv.lastMessage
                        ? conv.lastMessage.type === "image"
                          ? "Image"
                          : conv.lastMessage.type === "video"
                          ? "Video"
                          : conv.lastMessage.type === "file"
                          ? "File"
                          : conv.lastMessage.type === "voice"
                          ? "Voice"
                          :<LongWord word={ conv.lastMessage.content} letterLimit={15} />
                        : "Start chatting..."}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ListeConverstaion;
