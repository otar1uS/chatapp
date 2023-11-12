import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, postRequest, getRequest } from "../../utils/auth";
import { userChatsState, userState } from "../slices/authSlice";

export interface ErrorResponse {
  message: string | null;
}

export interface Message {
  chatId: string;
  senderId: string;
  text: string;
  createdAt?: Date;
}

interface CreatePostPayload {
  username?: string;
  email?: string;
  password?: string;
  firstId?: string;
  secondId?: string;
  endpoint?: string;
}

export const createPost = createAsyncThunk<
  userState,
  CreatePostPayload | null,
  { rejectValue: ErrorResponse }
>("create/post", async (postData, { rejectWithValue }) => {
  const postDataWithoutEndpoint = { ...postData };
  delete postDataWithoutEndpoint.endpoint;

  try {
    const response = await postRequest(
      `${baseUrl}/${postData?.endpoint}`,
      JSON.stringify(postDataWithoutEndpoint)
    );

    if (response.error) {
      return rejectWithValue({ message: response.message });
    }

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

export const getUsers = createAsyncThunk<
  userState[] | userChatsState[],
  string,
  { rejectValue: ErrorResponse }
>("get/users", async (getData, { rejectWithValue }) => {
  try {
    const response = await getRequest(`${baseUrl}/${getData}`);
    if (response.error) {
      return rejectWithValue({ message: response.message });
    }

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

export const postMessage = createAsyncThunk<
  Message,
  { chatId: string; senderId: any; text: string },
  { rejectValue: ErrorResponse }
>("post/message", async (messageData, { rejectWithValue }) => {
  try {
    const response = await postRequest(
      `${baseUrl}/message`,
      JSON.stringify(messageData)
    );

    if (response.error) {
      return rejectWithValue({ message: response.message });
    }

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});

export const getMessage = createAsyncThunk<
  { chatId: string; senderId: string; text: string },
  string,
  { rejectValue: ErrorResponse }
>("get/message", async (getData, { rejectWithValue }) => {
  try {
    const response = await getRequest(`${baseUrl}/message/${getData}`);
    if (response.error) {
      return rejectWithValue({ message: response.message });
    }

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }
    return rejectWithValue({ message: "An unknown error occurred" });
  }
});
