import { createBrowserRouter } from "react-router";
//pages
import Home from "@/pages/Home.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
//layout
import AppLayout from "@/layout/AppLayout.jsx";
//icons
import HomeIcon from '@mui/icons-material/Home';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import RootLayout from "@/layout/RootLayout";

export const protectedRoutes = [
  {
    path: "/",
    label: "Home",
    icon: HomeIcon,
    Component: Home,
  },
  {
    path: "/price",
    label: "Cotação",
    icon: RequestQuoteIcon,
    Component: Home,
  },
];

export const publicRoutes = [
  {
    path: "/auth/login",
    Component: Login,
  },
  {
    path: "/auth/register",
    Component: Register,
  },
];
  
const routes = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AppLayout,
        children: protectedRoutes,
      },
      ...publicRoutes,
    ]
  }
]);

export default routes;
  