import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUsers } from "../store/thunks/thunks";
import ChatList from "../components/chat/ChatList";
import ChatBox from "../components/chat/ChatBox";
import { io } from "socket.io-client";
import {
  addMessage,
  setNotifications,
  setOnlineUsers,
} from "../store/slices/authSlice";

interface Socket {
  id: string;
  connected: boolean;

  emit(event: string, ...args: any[]): void;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string): void;
  disconnect(): void;
}

function Chat() {
  const {
    newMessage,
    userChats,
    userId,

    chatOpener,
    data,
    pChats,
    selectedChat,
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    dispatch(getUsers("users"));
  }, [dispatch]);

  //! socket Stuff

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [data, dispatch]);

  useEffect(() => {
    if (socket === null) return;
    if (data?._id) socket?.emit("addNewUser", data?._id);
    socket?.on("getOnlineUsers", (res: object[]) => {
      dispatch(setOnlineUsers(res));
    });

    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [socket, data?._id, dispatch]);

  useEffect(() => {
    if (socket === null) return;
    const recipientId =
      selectedChat && selectedChat[0]?.members?.find((u) => u !== data?._id);

    socket?.emit(
      "sendMessage",
      {
        ...newMessage,
      },
      recipientId
    );
  }, [socket, newMessage, pChats, selectedChat, data?._id, dispatch]);

  //receive message and notifications
  useEffect(() => {
    if (socket === null) return;
    socket?.on("getMessage", (res) => {
      const curChatId = selectedChat && selectedChat[0]._id;

      if (curChatId !== res?.chatId) return;

      dispatch(addMessage({ ...res }));
    });

    socket?.on("getNotifications", (res) => {
      const isChatOpen = res.senderId === userId;

      if (isChatOpen) {
        dispatch(setNotifications({ ...res, isRead: true }));
      } else {
        dispatch(setNotifications({ ...res }));
      }
    });
    return () => {
      socket?.off("getMessage");
      socket?.off("getNotifications");
    };
  }, [socket, userChats, dispatch, userId, data?._id, selectedChat]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/4 p-4 bg-gray-200">
        <ChatList />
      </div>
      {chatOpener ? (
        <div className="md:w-3/4 p-4 bg-gray-100 mt-4 md:mt-0">
          <ChatBox />
        </div>
      ) : (
        <div className="md:w-3/4 p-4 flex justify-center bg-gray-900 text-white text-xl mt-4 md:mt-0">
          Open chat to start a conversation
        </div>
      )}
    </div>
  );
}

export default Chat;
