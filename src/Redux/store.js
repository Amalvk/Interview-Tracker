import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    todo: todoReducer
  }
});