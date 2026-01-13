import { createSlice } from "@reduxjs/toolkit";

const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') ?? '[]');
const savedCurrentUser = JSON.parse(localStorage.getItem("currentUser")??'[]');


const registerSlice = createSlice({
  name: "registerUsers",
initialState: {
  registeredUsers:
    savedUsers && savedUsers.length > 0
      ? savedUsers
      : [
          {
            id: 1,
            username: "Admin",
            email: "admin@shop.com",
            password: "admin123",
            role: "admin",
            isBlocked: false,
            orders: [],
            address: "",
            phone: ""
          }
        ],
  currentUser: savedCurrentUser || null
}
,

  reducers: {
registerUser: (state, action) => {
  const newUser = {
    id: Date.now(),
    ...action.payload,
    isBlocked: false,
    orders: [],
    address: "",
    phone: ""
  };

  state.registeredUsers.push(newUser);

  localStorage.setItem(
    "registeredUsers",
    JSON.stringify(state.registeredUsers)
  );
},

loginUser: (state, action) => {
  const { email, password } = action.payload;

  const user = state.registeredUsers.find(
  (u: any) => u.email === email && u.password === password
);

}

,

logoutUser: (state) => {
  state.currentUser = null;
  localStorage.removeItem("currentUser");
}
  }
});

export const {
  registerUser,
  loginUser,
  logoutUser
} = registerSlice.actions


export default registerSlice.reducer;
