import { createSlice } from '@reduxjs/toolkit';

const userActiveSlice = createSlice({
  name: 'userActiveSlice',
  initialState: 'no', // The initial state is a boolean
  reducers: {
    toggleState: (state, action) => {
      return action.payload; // Redux Toolkit allows mutating state directly, but you return a new value for primitives
    },
  },
});

export const { toggleState } = userActiveSlice.actions;
export default userActiveSlice.reducer;
