import React from 'react'
import { createSlice } from '@reduxjs/toolkit';

const UserInfoSlice = createSlice({
initialState:null,
name:'UserInfoSlice',
reducers:{

'SetUserInfo':(state,action)=>{

return action.payload;

}

}



})
export const { SetUserInfo } = UserInfoSlice.actions;
export default UserInfoSlice.reducer