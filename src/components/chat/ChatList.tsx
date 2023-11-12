import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import profilePicture from "../../assets/profilePic.svg";
import {
  openChat,
  setPotentialChats,
  setUserId,
  setSelectedChat,
} from "../../store/slices/authSlice";
import { getUsers } from "../../store/thunks/thunks";
import ChatUsers from "./ChatUser";

const ChatList: React.FC = () => {
  const { onlineUsers, allUsers, userChats, data } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getUsers(`chat/${data?._id}`));
  }, [dispatch, data]);

  const pChats = useMemo(() => {
    if (data && data?._id) {
      return allUsers?.filter((u) => {
        if (u && u._id && data?._id === u._id) return false;
        if (userChats) {
          return userChats.some(
            (chat) => chat.members[0] === u?._id || chat.members[1] === u?._id
          );
        }
        return true;
      });
    }
    return [];
  }, [allUsers, userChats, data]);

  useEffect(() => {
    dispatch(setPotentialChats(pChats));
  }, [pChats, dispatch]);

  const handleUserClick = (user) => {
    if (selectedUserId !== user._id) {
      dispatch(setUserId(user._id));
      setSelectedUserId(user._id);
    }
    dispatch(openChat());
  };

  useEffect(() => {
    const searcher = (u: string | null) => {
      return userChats?.filter(
        (chat) =>
          chat.members[0] === data?._id ||
          (u && chat.members[1] === u) ||
          data?._id
      );
    };
    if (selectedUserId) {
      dispatch(setSelectedChat(searcher(selectedUserId)));
    }
  }, [selectedUserId, dispatch, data?._id, userChats]);

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Potential users</h2>
      <ChatUsers />
      <ul>
        {pChats &&
          pChats?.map((user) => {
            return (
              <li
                key={user._id}
                className="flex gap-3 relative items-center space-x-2 cursor-pointer p-2  hover:bg-gray-300 rounded-md"
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={profilePicture}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-950">{user.username}</span>
                {onlineUsers &&
                  onlineUsers.some((u) => u.userId === user._id) && (
                    <div className="absolute top-1 left-0 rounded-full h-3 w-3 bg-green-600"></div>
                  )}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ChatList;
