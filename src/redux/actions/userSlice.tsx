import {createSlice} from "@reduxjs/toolkit";
const data = localStorage.getItem('userLog')
const UserData = JSON.parse(data);



export const userSlice = createSlice({
    name:"user",
    initialState:{
        // user: UserData ? UserData :null,
        isLoggedIn :  UserData ? UserData : false
        
    },
    reducers:{
        login:(state, action) => {
            state.isLoggedIn = action.payload;
            localStorage.setItem('userLog', JSON.stringify(action.payload));
        },
        logout:(state) => {
            state.isLoggedIn = false;
            localStorage.removeItem('userLog');
        },
    },
});

export const {login, logout} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
