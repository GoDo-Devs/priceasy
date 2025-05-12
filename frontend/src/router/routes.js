import { createBrowserRouter, useNavigate } from "react-router";
import Home from "@/pages/Home.jsx";
import LoginPage from "@/pages/auth/Login.jsx";
import RegisterPage from "@/pages/auth/Register.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import HomeIcon from '@mui/icons-material/Home';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import RootLayout from "@/layout/RootLayout";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import authService from '@/services/authService'

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
        path: "/admin",
        label: "Painel Administrativo",
        icon: ManageAccountsIcon,
        Component: Home,
        guard: [checkIfAdmin],
        children: [
          {
            path: "1",
            label: "Painel Administrativo",
            icon: ManageAccountsIcon,
            Component: Home,
            guard: [checkIfAdmin],
            children: [
              {
                path: "2",
                label: "Painel Administrativo",
                icon: ManageAccountsIcon,
                Component: Home,
                guard: [checkIfAdmin],
              }
            ],
          }
        ]
      }
    ],
  },
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
    children: [
      ...guardedAuthenticatedRoutes,
      ...guestRoutes,
    ]
  }
]);

function checkIfAdmin(next, user) {
  return user.is_admin ?? '/';
}

async function checkIfLoggedIn(next) {
  const { data } = await authService.me();
  return Boolean(data.user) ?? '/auth/login';
}

export default router;
