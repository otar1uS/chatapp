import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createPost } from "../store/thunks/thunks";
import Input from "./Input";

import { clearError } from "../store/slices/authSlice";

interface userState {
  username?: string;
  email?: string;
  password?: string;
}

function RegisterOptions({ isItRegister }: { isItRegister: boolean }) {
  const [stateUser, setStateUser] = useState<userState>({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = stateUser;

  const { error: registerError } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setStateUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const data = { username, email, password };
    if (isItRegister) {
      dispatch(createPost({ ...data, endpoint: `users/register` }));
      setStateUser({
        username: "",
        email: "",
        password: "",
      });
    }

    if (!isItRegister) {
      dispatch(createPost({ ...data, endpoint: `users/login` }));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [isItRegister, dispatch]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-2">
      <div className="bg-blue-400 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-slate-950">
          {isItRegister ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isItRegister && (
            <Input
              type="text"
              name="username"
              label="Name"
              value={username}
              onChange={handleChange}
              required
            />
          )}

          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            id="password"
            name="password"
            label="Password"
            value={password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover-bg-blue-600 transition-colors"
          >
            {isItRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>

      {registerError && (
        <div className="w-96 h-[3rem] flex items-center bg-white rounded justify-center text-red-600">
          <p>{registerError.error || registerError.message.error}</p>
        </div>
      )}
    </div>
  );
}

export default RegisterOptions;
