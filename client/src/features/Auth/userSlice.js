import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        login: (state, action) => {
            state = action.payload;
        },
        logout: (state, action) => {
            state = {};
        },
    },
});

const { actions, reducer } = userSlice;
export const { login, logout } = actions;
export default reducer;
