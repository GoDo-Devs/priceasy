import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home.jsx";
import LoginPage from "@/pages/auth/Login.jsx";
import RegisterPage from "@/pages/auth/Register.jsx";
import Product from "@/pages/product/Product.jsx";
import User from "@/pages/user/User.jsx"
import VehicleType from "@/pages/vehicle-type/VehicleType.jsx";

import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AppLayout from "@/layout/AppLayout.jsx";
import RootLayout from "@/layout/RootLayout";
import authService from "@/services/authService";

export const guardedAuthenticatedRoutes = [
  {
    Component: AppLayout,
    guard: [checkIfLoggedIn],
    children: [
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
      {
        label: "Painel Administrativo",
        icon: ManageAccountsIcon,
        guard: [checkIfAdmin],
        children: [
          {
            path: "/products",
            label: "Produtos",
            icon: ShoppingCartIcon,
            Component: Product,
            guard: [checkIfAdmin],
          },
          {
            path: "/vehicles-types",
            label: "Veículos",
            icon: LocalShippingIcon,
            Component: VehicleType,
            guard: [checkIfAdmin],
          },
          {
            path: "/users",
            label: "Usuários",
            icon: PersonIcon,
            Component: User,
            guard: [checkIfAdmin],
          },
        ],
      },
    ],
  }
];

const guestRoutes = [
  {
    path: "/auth/login",
    Component: LoginPage,
  },
  {
    path: "/auth/register",
    Component: RegisterPage,
  },
];


const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [...guardedAuthenticatedRoutes, ...guestRoutes],
  },
]);

function checkIfAdmin(next, user) {
  return user.is_admin ?? "/";
}

async function checkIfLoggedIn(next) {
  const { data } = await authService.me();
  return Boolean(data.user) ?? "/auth/login";
}

export default router;
