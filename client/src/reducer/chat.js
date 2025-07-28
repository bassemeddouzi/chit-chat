const initialState = {
  conversations: [],

  add_conv_loading: false,
  error_add_conv: null,

  get_converstations_loading: false,
  get_conversation_error: null,

  openedConversation: null,
  openedConversation_loading: true,

  openedMessages: [],
  get_opened_messages_loading: false,
  get_opened_messages_error: null,

  get_opened_conversation_files_loading: false,
  get_opened_conversation_files_error: null,
  opened_conversationFiles: [],

  send_message_loading: false,
  send_message_error: null,
  error: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CONVERSATIONS":
      return {
        ...state,
        conversations: action.payload,
        openedConversation: !state.openedConversation
          ? action.payload[0]
          : state.openedConversation,
        openedConversation_loading: false,
      };
    case "GET_CONVERSATION_LOADIONG":
      return { ...state, get_converstations_loading: true };
    case "STOP_GET_CONVERSATION_LOADIONG":
      return { ...state, get_converstations_loading: false };
    case "GET_CONVERSATION_ERROR":
      return { ...state, get_conversation_error: action.payload };

    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case "ADD_CONVERSATION_LOADING":
      return { ...state, add_conv_loading: true };
    case "STOP_ADD_CONVERSATION_LOADING":
      return { ...state, add_conv_loading: false };
    case "ADD_CONVERSATION_ERROR":
      return { ...state, error_add_conv: action.payload };

    case "UPDATE_CONVERSATION_LAST_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((conversation) => {
          if (conversation._id === action.payload.conversation) {
            return {
              ...conversation,
              lastMessage: action.payload,
              updatedAt: Date.now(),
            };
          }
          return conversation;
        }),
      };

    case "OPEN_CONVERSATION":
      return {
        ...state,
        openedConversation: action.payload,
        openedConversation_loading: false,
        get_opened_messages_loading: true,
      };

    case "GET_OPENED_MESSAGES":
      const newMessages = action.payload.reverse();
      const existingIds = new Set(state.openedMessages.map((m) => m._id));

      const filtered = newMessages.filter((m) => !existingIds.has(m._id));

      return {
        ...state,
        openedMessages: [...filtered, ...state.openedMessages],
        get_opened_messages_loading: false,
      };

    case "GET_OPENED_MESSAGES_STOP_LOADING":
      return { ...state, get_opened_messages_loading: false };
    case "GET_OPENED_MESSAGES_LOADING":
      return { ...state, get_opened_messages_loading: true };
    case "GET_OPENED_MESSAGES_ERROR":
      return { ...state, get_opened_messages_error: action.payload };

    case "ADD_MESSAGE_OPENED_CONVERSATION":
      return {
        ...state,
        openedMessages: [...state.openedMessages, action.payload],
      };
    case "ADD_MESSAGE_OPENED_CONVERSATION_LOADING":
      return { ...state, send_message_loading: true };
    case "ADD_MESSAGE_OPENED_CONVERSATION_STOP_LOADING":
      return { ...state, send_message_loading: false };
    case "ADD_MESSAGE_OPENED_CONVERSATION_ERROR":
      return { ...state, send_message_error: action.payload };

    case "SEND_FILE_LOADING_STOP":
      return { ...state, send_message_loading: false };
    case "SEND_FILE_LOADING":
      return { ...state, send_message_loading: true };
    case "SEND_FILE_ERROR":
      return { ...state, send_message_error: action.payload };

    case "UPDATE_CONVERSATION":
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv._id === action.payload._id ? action.payload : conv
        ),
        openedConversation:
          state.openedConversation &&
          state.openedConversation._id === action.payload._id
            ? action.payload
            : state.openedConversation,
      };
    case "RECEIVE_MESSAGE":
      if (!state.openedConversation) return state;
      if (state.openedConversation._id !== action.payload.conversation)
        return state;
      return {
        ...state,
        openedConversation: {
          ...state.openedConversation,
          messages: [
            ...(state.openedConversation.messages || []),
            action.payload,
          ],
        },
      };
    // case "GET_MESSAGES":
    //   let newMessages = [];
    //   if (state.openedConversation?.messages) {
    //     newMessages = [...state.openedConversation.messages].filter(
    //       (message) => !action.payload.find((msg) => msg._id === message._id)
    //     );
    //   }
    //   return {
    //     ...state,
    //     openedConversation: {
    //       ...state.openedConversation,
    //       messages: [...newMessages, ...action.payload],
    //     },
    //   };
    case "SEND_MESSAGE":
      if (!state.openedConversation) return state;
      if (state.openedConversation._id !== action.payload.conversation)
        return state;
      return {
        ...state,
        openedConversation: {
          ...state.openedConversation,
          messages: [
            ...(state.openedConversation.messages || []),
            action.payload,
          ],
        },
      };
    case "ERROR":
      return { ...state, error: action.payload };
    case "CLEAN_UP_EVERTHING":
      return { ...initialState };
    default:
      return state;
  }
};
export default chatReducer;
