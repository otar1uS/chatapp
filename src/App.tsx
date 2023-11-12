import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAppSelector } from "./store/hooks";
import ErrorPage from "./pages/ErrorPage";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV == "production") disableReactDevTools();
function App() {
  const { data: user } = useAppSelector((state) => state.auth);

  return (
    <div className="container min-h-screen mx-auto">
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Chat /> : <Login />} />
        <Route path={"/register"} element={user ? <Chat /> : <Register />} />
        <Route path={"/login"} element={user ? <Chat /> : <Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
