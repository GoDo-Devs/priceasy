import { createBrowserRouter } from "react-router";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
  
const routes = createBrowserRouter([
    {
      path: "/",
      Component: Home
    },
    {
      path: "/auth/login",
      Component: Login
    },
    {
      path: "/auth/register",
      Component: Register
    },
]);

export default routes;
  