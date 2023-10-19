import { createSlice } from "@reduxjs/toolkit"


const initialState = {

  loading: false,
  errores: null,
  isAuthenticated: false,
  users: []
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
    allUsers: (state) => {
      state.users = action.payload
    }
  }
})

export const { loginRequest, loginSuccess, loginFailure, clearToken, allUsers } = authSlice.actions
export default authSlice.reducer