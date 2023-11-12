import { createSlice } from "@reduxjs/toolkit";

import {
  createPost,
  getMessage,
  getUsers,
  Message,
  postMessage,
} from "../thunks/thunks";

export interface userState {
  username?: string;
  email?: string;
  password?: string;
  _id?: string;
}

export type UserSocketInfo = {
  userId: string;
  socketId: string;
};

export interface userChatsState {
  _id: string;
  members: string[];
}

export interface notificationsState {
  senderId: string;
  isRead: boolean;
  date: Date;
}

function checker() {
  const item = localStorage.getItem("User");
  if (item) {
    const parsedData = JSON.parse(item);
    if (
      parsedData !== null &&
      typeof parsedData === "object" &&
      !Array.isArray(parsedData)
    ) {
      return parsedData;
    }
  }
  return null;
}

interface AuthState {
  allUsers: userState[] | null;
  errorGet: any;
  loadingGet: boolean | null;
  data: userState | null;
  error: any;
  loading: boolean | null;
  userChats: userChatsState[] | null;
  errorMsg: any;
  loadingMsg: boolean | null;
  messages: any;
  chatOpener: boolean | null;
  userId: string | null;
  newMessage: Message | null;
  notifications: notificationsState[];
  onlineUsers: UserSocketInfo[] | null;
  pChats: userState[] | null;
  selectedChat: userChatsState[] | null;
}

// initial state

const initialState: AuthState = {
  errorGet: null,
  loadingGet: null,
  allUsers: null,
  data: checker() || null,
  error: null,
  loading: null,
  userChats: null,
  loadingMsg: null,
  errorMsg: null,
  messages: null,
  chatOpener: false,
  userId: null,
  newMessage: null,
  onlineUsers: null,
  notifications: [],
  pChats: [],
  selectedChat: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openChat(state) {
      state.chatOpener = !state.chatOpener;
    },

    userRemove(state) {
      state.data = null;
    },
    clearError(state) {
      state.error = null;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },

    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    addMessage(state, action) {
      state.messages?.push(action.payload);
    },
    setNotifications(state, action) {
      if (action.payload.senderId) state.notifications.push(action.payload);
    },
    markAllNotificationsAsRead(state) {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        isRead: true,
      }));
    },
    markNotificationRead(state, action) {
      // const chat = state.selectedChat;

      const mNotifications = state.notifications.map((el) => {
        if (action.payload.senderId === el.senderId) {
          return { ...action.payload.notif, isRead: true };
        } else {
          return el;
        }
      });

      state.notifications = mNotifications;
    },
    setPotentialChats(state, action) {
      state.pChats = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loadingGet = true;

        if ("members" in action.payload) {
          state.userChats?.push(action.payload as userChatsState);
        } else {
          state.data = action.payload;
          localStorage.setItem("User", JSON.stringify(action.payload));
        }
        state.loadingGet = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.loadingGet = true;
        state.errorGet = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        const response = action.payload as userState[] | userChatsState[];

        const members = response.some((member) => "members" in member);

        if (members) {
          state.userChats = response as userChatsState[];
        } else {
          state.allUsers = response as userState[];
        }

        state.loadingGet = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loadingGet = false;
        state.errorGet = action.payload;
      })
      .addCase(postMessage.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(postMessage.fulfilled, (state, action) => {
        state.messages?.push(action.payload);
        state.newMessage = action.payload;
        state.loadingMsg = false;
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.loadingMsg = false;
        state.errorMsg = action.payload;
      })
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
        state.errorMsg = null;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.loadingMsg = false;
        state.messages = action.payload;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loadingMsg = false;
        state.errorMsg = action.payload;
      });
  },
});

export const {
  userRemove,
  clearError,
  openChat,
  setUserId,
  setOnlineUsers,
  addMessage,
  setNotifications,
  setPotentialChats,
  setSelectedChat,
  markAllNotificationsAsRead,
  markNotificationRead,
} = authSlice.actions;
export default authSlice.reducer;
