import React from "react";
import NavBardDisscusion from "./discussion/NavBar";
import MessagingArea from "./discussion/Messaging/MessagingArea";

import InputMessaging from "./discussion/InputMessaging";

function Discussion() {

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full  bg-white shadow-md overflow-hidden">
      <NavBardDisscusion />
      <MessagingArea />
      <InputMessaging />
    </div>
  );
}

export default Discussion;
