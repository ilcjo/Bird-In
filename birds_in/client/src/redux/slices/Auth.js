import { createSlice } from "@reduxjs/toolkit"


const initialState ={  

    loading: false,
    errores: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.errores = null;
          },
          loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
          },
          loginFailure: (state, action) => {
            state.loading = false;
            state.errores = action.payload;
          },
          clearToken: (state) => {
            state.isAuthenticated = false;
          },
    }
})

export const { loginRequest, loginSuccess, loginFailure, clearToken} = authSlice.actions
export default authSlice.reducer