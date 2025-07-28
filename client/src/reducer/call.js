const initialState = {
  inCall: false,
  callType: null,
  peerConnection: null,
  mediaStream: null,

  outgoingCall: null,
  incomingCall: null,
};

const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVED_SOCKET_ID":
      return {
        ...state,
        outgoingCall: action.payload,
        callType: action.payload.type,
      };

    case "INCOMING_CALL":
      return {
        ...state,
        incomingCall: action.payload,
        callType: action.payload.type,
      };
    case "ACCEPT_CALL":
    case "CALL_ACCEPTED":
      return {
        ...state,
        inCall: true,
        peerConnection: action.payload.peerConnection,
        mediaStream: action.payload.mediaStream,
        incomingCall: null,
        outgoingCall: null,
      };
    case "REJECT_CALL":
    case "CALL_REJECTED":
      return {
        ...state,
        inCall: false,
        peerConnection: null,
        mediaStream: null,
        incomingCall: null,
        outgoingCall: null,
      };
    case "END_CALL":
    case "CALL_ENDED":
      return {
        ...state,
        inCall: false,
        peerConnection: null,
        mediaStream: null,
        incomingCall: null,
        outgoingCall: null,
      };

    case "CALL_ERROR":
      return {
        ...state,
        callError: action.payload,
      };

    case "CLEAR_CALL_STATE":
      return { ...initialState };

    default:
      return state;
  }
};

export default callReducer;
