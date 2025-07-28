import userReducer from './user';
import chatReducer from './chat';
import callReducer from './call';
import { combineReducers } from 'redux';
const rootRuducer = combineReducers( {
  user: userReducer,
  chat: chatReducer,
  call: callReducer
})
export default rootRuducer;