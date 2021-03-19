import {combineReducers} from "redux";
import thunkMiddleWare from 'redux-thunk';
import {reducer} from "./reducer";
import {configureStore} from "@reduxjs/toolkit";


const reducers = combineReducers({
   reducer: reducer
})


export type AppStateType = ReturnType<typeof reducers>



export const store = configureStore({
   reducer: reducers,
   middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleWare)
})



