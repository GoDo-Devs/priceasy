import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import HomeIcon from '@mui/icons-material/Home';
  
const routes = createBrowserRouter([
    {
      path: "/auth/login",
      Component: Login
    },
    {
      path: "/auth/register",
      Component: Register
    },
    {
      Component: AppLayout,
      children: [
        {
          path: "/",
          icon: HomeIcon,
          Component: Home
        },
        {
          path: "/teste",
          Component: Home
        },
      ]
    }
]);

export default routes;
  