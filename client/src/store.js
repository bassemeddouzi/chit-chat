import { configureStore } from '@reduxjs/toolkit';
import rootRuducer from './reducer'
const store = configureStore({
  reducer: rootRuducer
});
export default store;