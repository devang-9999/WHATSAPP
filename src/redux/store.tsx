import { configureStore } from "@reduxjs/toolkit";
import  registerReducer  from "./registerSlice";


export const store = configureStore({

    reducer:{
        users : registerReducer ,
    }   
 });

