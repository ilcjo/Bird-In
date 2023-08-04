import { createSlice } from "@reduxjs/toolkit"


const initialState ={  
    user: null,
    token: null,
    loading: false,
    error: null,
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
            state.user = action.payload.user;
            state.token = action.payload.token;
          },
          loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
    }
})

export const { loginRequest, loginSuccess, loginFailure} = authSlice.actions
export default authSlice.reducer