import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPost } from "../../store/thunks/thunks";

function ChatUsers() {
  const { onlineUsers, allUsers, data } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.auth.userChats);

  const potentialUsers = allUsers?.filter((user) => {
    const chatExists = chats?.some((chat) => {
      return (
        (chat.members[0] === data?._id || chat.members[1] === data?._id) &&
        (chat.members[0] === user._id || chat.members[1] === user._id)
      );
    });

    return user.email !== data?.email && !chatExists;
  });

  return (
    <div className="flex w-full ">
      <div className="flex flex-col xl:flex-row gap-2">
        {potentialUsers?.map((user) => (
          <div
            key={user._id}
            onClick={() =>
              dispatch(
                createPost({
                  firstId: data?._id,
                  secondId: user._id,
                  endpoint: "chat",
                })
              )
            }
            className="flex rounded-xl relative p-2 cursor-pointer bg-cyan-950 text-gray-100 leading-4 md:leading-5   text-sm md:text-lg"
          >
            {user.username}
            {onlineUsers && onlineUsers.some((u) => u.userId == user._id) && (
              <div className="absolute top-[-10%]  left-0 rounded-full h-3 w-3 bg-green-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatUsers;
