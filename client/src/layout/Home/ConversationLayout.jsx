import React from "react";
import ListeConverstaion from "../../components/ConversationList";
import MessagingArea from "../../components/discussion/Messaging/MessagingArea";
import NavBardDisscusion from "../../components/discussion/NavBar";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import Discussion from "../../components/Discussion";
function ConversationLayout() {
  const getOpenedConvLoading = useSelector(
    (state) => state.chat.openedConversation_loading
  );
  const conversations = useSelector((state) => state.chat.conversations);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full">
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
        <ListeConverstaion />
      </div>
      <div className="flex-1 flex flex-col relative">
        {getOpenedConvLoading ? (
          <div className="absolute backdrop-blur-sm w-full h-full top-0 left-0 z-10 flex items-center justify-center">
            <Loader className="animate-spin text-gray-700" />
          </div>
        ) :  conversations.length>0 ?(
            <Discussion />
        ):(
          <h1 className="text-lg  font-bold mb-6 text-center text-gray-800">
            Start a New conversation .... 😁
          </h1>
        )
      }
      </div>
    </div>
  );
}

export default ConversationLayout;
