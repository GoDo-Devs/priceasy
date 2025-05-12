import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useLocation } from "react-router";
import { guardedAuthenticatedRoutes } from "../router/routes";

function LayoutAppBar({ setOpenDrawer, openDrawer }) {
  const location = useLocation();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: "9999" }}
      color="defaultBg"
      elevation={0}
      enableColorOnDark
    >
      <Toolbar>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ width: 60, marginRight: 2 }}
        />
        {/* <Typography fontSize={20} fontWeight={700}>{route.label}</Typography> */}
      </Toolbar>
    </AppBar>
  );
}

export default LayoutAppBar;
