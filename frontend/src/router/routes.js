import { createBrowserRouter } from "react-router";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
  
const routes = createBrowserRouter([
    {
      path: "/",
      Component: Home
    },
    {
      path: "/auth/login",
      Component: Login
    },
]);

export default routes;
  