import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../../socket/socketIO";
import { getMessages, sendMessage } from "../../../api/chat";
import { Loader } from "lucide-react";
import fileIcone from "../../../assets/file-icon.png";
import TextShowMore from "../../Tools/TextShowMore";
import MediaLoader from "./MediaLoader";
function MessagingArea() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const openedConversation = useSelector(
    (state) => state.chat.openedConversation
  );
  const messagesListe = useSelector((state) => state.chat.openedMessages);
  const loading_Messages = useSelector(
    (state) => state.chat.get_opened_messages_loading
  );
  const error = useSelector((state) => state.chat.get_opened_messages_error);

  const containerRef = useRef(null);
  const messageEndRef = useRef(null);
  const isFetchingRef = useRef(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (openedConversation?._id) {
      setPage(1);
      setHasMore(true);
      dispatch(getMessages(token, openedConversation._id, 1));
    }
  }, [openedConversation?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesListe]);

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container || isFetchingRef.current || !hasMore) return;

    if (container.scrollTop === 0) {
      isFetchingRef.current = true;
      const prevScrollHeight = container.scrollHeight;

      const nextPage = page + 1;
      const result = await dispatch(
        getMessages(token, openedConversation._id, nextPage)
      );

      if (!result || result.length < 25) {
        setHasMore(false);
      }

      setPage(nextPage);

      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
        isFetchingRef.current = false;
      }, 100);
    }
  };

  if (loading_Messages && page === 1)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p>{error}</p>
      </div>
    );
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50 scroll-smooth"
    >
      <div className="flex justify-center items-center py-2">
        {loading_Messages && page > 1 ? (
          <Loader className="animate-spin text-gray-400 w-5 h-5" />
        ) : !hasMore ? (
          <p className="text-xs text-gray-400">No more messages</p>
        ) : null}
      </div>

      {messagesListe.map((msg, i, arr) => {
        const isMine = msg.senderId?._id === user._id;
        const prevMsg = arr[i - 1];
        const nextMsg = arr[i + 1];

        const showSenderName =
          !prevMsg || prevMsg?.senderId?._id !== msg.senderId?._id;

        const isLastMine =
          isMine && (!nextMsg || nextMsg?.senderId?._id !== msg.senderId?._id);

        return (
          <div key={msg._id} className="flex flex-col space-y-1">
            <div
              className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                isMine
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.type === "text" ? (
                <TextShowMore text={msg.content} wordLimit={10} />
              ) : msg.type === "image" ? (
                <MediaLoader
                  key={msg._id}
                  type="image"
                  src={"http://localhost:5000" + msg.content}
                />
              ) : msg.type === "video" ? (
                <MediaLoader
                  key={msg._id}
                  type="video"
                  src={"http://localhost:5000" + msg.content}
                />
              ) : msg.type === "voice" ? (
                <MediaLoader
                  key={msg._id}
                  type="audio"
                  src={"http://localhost:5000" + msg.content}
                />
              ) : null}
            </div>

            {isLastMine && (
              <div className="text-[10px] text-gray-400 text-right pr-1">
                {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}

            {!isMine && (
              <div className="text-[10px] text-gray-400 text-left pl-1">
                {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        );
      })}

      <div ref={messageEndRef} />
    </div>
  );
}

export default MessagingArea;
