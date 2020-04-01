import { combineReducers } from '@reduxjs/toolkit';
import UserModule from './modules/Home/UserModule';


const rootReducer = combineReducers({
  //
  user: UserModule.reducer,
  
});

export default rootReducer;
