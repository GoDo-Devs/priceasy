import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home";
import Login from "../pages/Login";
  
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
  