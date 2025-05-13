import { useEffect, useContext } from "react";
import { Outlet, useLocation } from "react-router";
import AppDrawer from "./AppDrawer";
import { Box, useMediaQuery } from "@mui/material";
import LayoutAppBar from "./LayoutAppBar";
import { guardedAuthenticatedRoutes } from "../router/routes";
import useNavigateTo from "../hooks/useNavigateTo";
import { LayoutContext } from "../contexts/layoutContext";

function AppLayout() {
  const { drawerWidth, openDrawer, setOpenDrawer, isMobile, setDrawerWidth } =
    useContext(LayoutContext);
  const location = useLocation();
  const { runGuards } = useNavigateTo();

  useEffect(() => {
    runGuards(location.pathname);
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex" }}>
      <LayoutAppBar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <AppDrawer
        open={openDrawer}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        setDrawerWidth={setDrawerWidth}
        setOpenDrawer={setOpenDrawer}
      />
      <Box component="main" className="mt-16">
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
