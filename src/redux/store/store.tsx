import { configureStore} from "@reduxjs/toolkit";
import userReducer from "../actions/userSlice";
const store = configureStore({
    reducer:{
        user:userReducer,
    }
})
export default store