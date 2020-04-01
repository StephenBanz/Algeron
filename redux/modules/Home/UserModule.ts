import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let initialState = {
  avatar: '1',
  email: '2',
  name: '3',
  push_token: '4',
}

const UserModule = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    // setChange
    setChangeUser: (state, action) => {
      const {
        avatar,
        email,
        name,
        push_token,
      } = action.payload;

      state.avatar = avatar;
      state.email = email;
      state.name = name;
      state.push_token = push_token;
    },

    // clear
    clear: (state, action ) => {
      return initialState;
    },
  },
});


export default UserModule;
