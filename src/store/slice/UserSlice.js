import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "Anonymous",
    email: "",
    token: localStorage.getItem("virtualToken"),
    id: "",
    roles: null
  },
  reducers: {
    setUserSlice: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("virtualToken", state.token);
      const payload = state.token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
      const data = JSON.parse(atob(payload));
      state.username = data.name;
      state.email = data.email;
      state.id = data.id;
      state.roles = data.roles;
    }
  }
});

export const { setUserSlice } = userSlice.actions;
export default userSlice.reducer;
