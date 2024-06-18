import { configureStore } from '@reduxjs/toolkit';

import useReducer from 'features/Auth/userSlice';

const rootReducer = {
    user: useReducer,
};

const store = configureStore({
    reducer: rootReducer,
});

export default store;
