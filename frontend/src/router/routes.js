import { createBrowserRouter } from "react-router";
import Home from "@/pages/Home.jsx";
import LoginPage from "@/pages/auth/Login.jsx";
import RegisterPage from "@/pages/auth/Register.jsx";
import Product from "@/pages/product/Product.jsx";
import User from "@/pages/user/User.jsx";
import VehicleCategory from "@/pages/vehicle-category/VehicleCategory.jsx";
import Implement from "@/pages/implement/Implement.jsx";
import Simulation from "@/pages/simulation/Simulation.jsx";
import Service from "@/pages/service/Service.jsx";
import Plan from "@/pages/plan/Plan.jsx";
import PlanAdd from "@/pages/plan/PlanAdd.jsx";
import PriceTable from "../pages/price-table/PriceTable";
import HomeIcon from "@mui/icons-material/Home";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AppLayout from "@/layout/AppLayout.jsx";
import RootLayout from "@/layout/RootLayout";
import authService from "@/services/authService";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import DiscountIcon from "@mui/icons-material/Discount";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import PriceTableAdd from "../pages/price-table/PriceTableAdd";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import Coupon from "../pages/coupon/Coupon";

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
        path: "/cotacao",
        label: "Cotação",
        icon: RequestQuoteIcon,
        Component: Simulation,
      },
      {
        label: "Administrativo",
        icon: ManageAccountsIcon,
        guard: [checkIfAdmin],
        children: [
          {
            path: "/servicos",
            label: "Serviços",
            icon: MiscellaneousServicesIcon,
            Component: Service,
          },
          {
            path: "/planos",
            label: "Planos",
            icon: DiscountIcon,
            Component: Plan,
          },
          {
            path: "/plano",
            label: "Planos",
            icon: DiscountIcon,
            Component: PlanAdd,
            hidden: true,
          },
          {
            path: "/tabelas",
            label: "Tabela de Preços",
            icon: PriceChangeIcon,
            Component: PriceTable,
          },
          {
            path: "/adicionar-tabela",
            label: "Tabela de Preços",
            icon: DiscountIcon,
            Component: PriceTableAdd,
            hidden: true,
          },
          {
            path: "/produtos",
            label: "Produtos",
            icon: ShoppingCartIcon,
            Component: Product,
          },
          {
            path: "/implementos",
            label: "Implementos",
            icon: AutoAwesomeIcon,
            Component: Implement,
          },
          {
            path: "/categoria",
            label: "Veículos",
            icon: LocalShippingIcon,
            Component: VehicleCategory,
          },
          {
            path: "/cupons",
            label: "Cupons",
            icon: LocalActivityIcon,
            Component: Coupon,
          },
          {
            path: "/usuarios",
            label: "Usuários",
            icon: PersonIcon,
            Component: User,
          },
        ],
      },
    ],
  },
];

const guestRoutes = [
  {
    path: "/auth/login",
    Component: LoginPage,
  },
];

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [...guardedAuthenticatedRoutes, ...guestRoutes],
  },
]);

function checkIfAdmin(user) {
  if (!user) return false;
  return user.is_admin === true;
}

async function checkIfLoggedIn(next) {
  const { data } = await authService.me();
  return data.user ?? "/auth/login";
}

export default router;
