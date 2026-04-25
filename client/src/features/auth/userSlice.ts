import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    saveJobPost: (state, action) => {
      state.user?.saved.push(action.payload);
    },
    unsaveJobPost: (state, action) => {
      if (state.user) {
        state.user.saved = state.user.saved.filter(
          (jobId: any) => jobId !== action.payload,
        );
      }
    },
    createApplication: (state, action) => {
      if (state.user) {
        state.user.applications.push(action.payload);
      }
    },
    changeEmail: (state, action) => {
      if (state.user) {
        state.user.email = action.payload;
        state.user.is_email_verified = false;
      }
    },
    verifyEmail: (state) => {
      if (state.user) {
        state.user.is_email_verified = true;
      }
    },
  },
});

export const {
  signIn,
  saveJobPost,
  unsaveJobPost,
  createApplication,
  logout,
  changeEmail,
  verifyEmail,
  updateProfile,
} = userSlice.actions;

export default userSlice.reducer;
