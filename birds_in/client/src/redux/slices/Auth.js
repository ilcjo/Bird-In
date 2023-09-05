import { createSlice } from "@reduxjs/toolkit"


const initialState ={  
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
          },
          loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.nombre;
            state.token = action.payload.token;
            state.isAuthenticated = true;
          },
          loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          clearToken: (state) => {
            state.token = null;
            state.isAuthenticated = false;
          },
    }
})

export const { loginRequest, loginSuccess, loginFailure, clearToken} = authSlice.actions
export default authSlice.reducer