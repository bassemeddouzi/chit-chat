import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendFile } from "../../api/chat";
import { Upload, Send, Mic, MicOff, Video, VideoOff } from "lucide-react";
import fileIcone from "../../assets/file-icon.png";
import socket from "../../socket/socketIO";
import VoiceRecorder from "./Vocal/Recording";
import VideoRecorder from "./Video/Recording";
function InputMessaging() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const openedConversation = useSelector(
    (state) => state.chat.openedConversation
  );

  const [message, setMessage] = useState("");

  const [file_message, setFile_message] = useState(null);
  const fileInputRef = useRef(null);

  const [recordingVoice, setRecordingVoice] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState(false);
  const [closeRecording, setCloseRecording] = useState(false);

  const [recordingVideo, setRecordingVideo] = useState(null);
  const [recordingVideoStatus, setRecordingVideoStatus] = useState(false);
  const [closeRecordingVideo, setCloseRecordingVideo] = useState(false);

  const handleSend = async () => {
    if (!message.trim() && !file_message && !recordingVoice && !recordingVideo)
      return;

    const to_user =
      openedConversation.participant1._id === user._id
        ? openedConversation.participant2._id
        : openedConversation.participant1._id;

    if (message.trim()) {
      const textMessage = {
        conversation: openedConversation._id,
        senderId: user,
        content: message,
        read: true,
        timestamp: Date.now(),
        type: "text",
      };

      socket.emit("sendMessage", { newMessage: textMessage, to_user });
      dispatch({
        type: "ADD_MESSAGE_OPENED_CONVERSATION",
        payload: textMessage,
      });
      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: { ...textMessage, read: true },
      });
      setMessage("");
    }

    if (recordingVoice) {
      const audioFile = new File([recordingVoice], "audio.webm", {
        type: "audio/webm",
      });

      const voiceMeta = {
        conversation: openedConversation._id,
        senderId: user,
        read: false,
        timestamp: Date.now(),
        type: "voice",
        to_user,
      };

      const fileName = await dispatch(sendFile(token, { ...voiceMeta, content: audioFile }));
      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: voiceMeta,
      });
      dispatch({
        type: "ADD_MESSAGE_OPENED_CONVERSATION",
        payload: {...voiceMeta, content: fileName},
      });

      setRecordingVoice(null);
      setRecordingStatus(false);
    }

    if (recordingVideo) {
      const videoFile = new File([recordingVideo], "video.webm", {
        type: "video/webm",
      });

      const videoMeta = {
        conversation: openedConversation._id,
        senderId: user,
        type: "video",
        read: true,
        timestamp: Date.now(),
        to_user,
      };

      const fileName = await dispatch(sendFile(token, { ...videoMeta, content: videoFile }));
      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: videoMeta,
      });
      dispatch({
        type: "ADD_MESSAGE_OPENED_CONVERSATION",
        payload: {...videoMeta, content: fileName},
      });

      setRecordingVideo(null);
      setRecordingVideoStatus(false);
    }

    if (file_message) {
      const fileType = file_message.type;
      const primaryType = fileType.split("/")[0];

      let mappedType = "file";
      if (primaryType === "image") mappedType = "image";
      else if (primaryType === "video") mappedType = "video";
      else if (primaryType === "audio") mappedType = "voice";
      else if (fileType === "application/pdf") mappedType = "file";
      else return;

      const fileMeta = {
        conversation: openedConversation._id,
        senderId: user,
        type: mappedType,
        to_user,
        read: true,
        timestamp: Date.now(),
      };

      const FileName = await dispatch(sendFile(token, { ...fileMeta, content: file_message }));
      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: fileMeta,
      });
      dispatch({
        type: "ADD_MESSAGE_OPENED_CONVERSATION",
        payload: {...fileMeta, content: FileName},
      });

      setFile_message(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }

    setCloseRecordingVideo(true);
    setTimeout(() => setCloseRecordingVideo(false), 500);

    setCloseRecording(true);
    setTimeout(() => setCloseRecording(false), 500);
  };

  return (
    <div className=" p-4 border-t border-gray-200 bg-white">
      {file_message && (
        <div className="flex items-center p-4 border-t border-gray-200 bg-white">
          <button onClick={() => setFile_message(null)} className=" col-span-3">
            {file_message.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file_message)}
                alt="Preview"
                className="w-auto h-20"
              />
            )}
            {file_message.type.startsWith("video/") && (
              <video src={URL.createObjectURL(file_message)} alt="Preview" />
            )}
            {file_message.type.startsWith("application/pdf") && (
              <img src={fileIcone} alt="Preview" />
            )}
          </button>
        </div>
      )}
      {!closeRecording && (
        <VoiceRecorder
          close={closeRecording}
          start={recordingStatus}
          stop={!recordingStatus}
          setRecordingVoice={setRecordingVoice}
        />
      )}

      {!closeRecordingVideo && (
        <VideoRecorder
          close={closeRecordingVideo}
          start={recordingVideoStatus}
          stop={!recordingVideoStatus}
          setRecordingVideo={setRecordingVideo}
        />
      )}

      <div className="flex items-center p-4 border-t border-gray-200 bg-white">
        {!recordingStatus && (
          <button
            className="mr-2 cursor-pointer"
            onClick={() => setRecordingStatus(!recordingStatus)}
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
        )}
        {recordingStatus && (
          <button
            className="mr-2 cursor-pointer"
            onClick={() => {
              setRecordingStatus(!recordingStatus);
            }}
          >
            <MicOff className="w-5 h-5 text-red-600" />
          </button>
        )}
        {!recordingVideoStatus && (
          <button
            className="mr-2 cursor-pointer"
            onClick={() => setRecordingVideoStatus(!recordingVideoStatus)}
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
        )}
        {recordingVideoStatus && (
          <button
            className="mr-2 cursor-pointer"
            onClick={() => setRecordingVideoStatus(!recordingVideoStatus)}
          >
            <VideoOff className="w-5 h-5 text-red-600" />
          </button>
        )}

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="mr-2 cursor-pointer"
        >
          <Upload className="w-5 h-5 text-gray-600" />
        </button>

        <input
          onChange={(e) => setFile_message(e.target.files[0])}
          type="file"
          accept="image/*, video/*, application/pdf"
          ref={fileInputRef}
          className="hidden"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default InputMessaging;
