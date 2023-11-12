import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import Notification from "./chat/Notification";
import { userRemove } from "../store/slices/authSlice";
function Navbar() {
  const { data: user, allUsers } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const username = allUsers?.filter((u) => u._id == user?._id);

  return (
    <div className="w-full h-20">
      <div className="flex w-full h-full justify-between items-center text-cyan-400 leading-6">
        <h1>ChatApp</h1>
        {user && (
          <h1>
            Logged in as{" "}
            <span className=" ">
              {username &&
                username[0]?.username &&
                username[0]?.username.charAt(0).toUpperCase() +
                  username[0]?.username.slice(1).toLowerCase()}
            </span>
          </h1>
        )}

        <h1></h1>
        <div className="gap-4 flex items-center ">
          {!user ? (
            <>
              <h2>
                <Link to="/register">Register</Link>
              </h2>
              <h2>
                <Link to="/login">Login</Link>
              </h2>
            </>
          ) : (
            <>
              <Notification />
              <img src="" alt="" />
              <h2
                onClick={() => {
                  dispatch(userRemove());
                  localStorage.removeItem("User");
                }}
              >
                <Link to="/login">Logout</Link>
              </h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
