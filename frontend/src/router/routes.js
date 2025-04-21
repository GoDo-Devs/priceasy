import { createBrowserRouter } from "react-router";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
  
const routes = createBrowserRouter([
    {
      path: "/",
      Component: Home
    },
    {
      path: "/login",
      Component: Login
    },
]);

export default routes;
  