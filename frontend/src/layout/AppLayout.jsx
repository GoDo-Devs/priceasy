import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import AppDrawer from "./AppDrawer";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import LayoutAppBar from "./LayoutAppBar";
import authService from "@/services/authService";
import { AuthContext } from "../contexts/authContext";

function AppLayout() {
  const [drawerWidth, setDrawerWidth] = useState(230);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    setIsMobile(!isMdOrUp);
    setOpenDrawer(isMdOrUp);
  }, [isMdOrUp])

  useEffect(() => {
    authService.me();
  }, [location.pathname])

  return (
    <Box sx={{ display: "flex" }}>
      <LayoutAppBar
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      />
      <AppDrawer
        open={openDrawer}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        setDrawerWidth={setDrawerWidth}
        setOpenDrawer={setOpenDrawer}
      />
      <Box component="main" className="mt-21">
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
