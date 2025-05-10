import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

function LayoutAppBar({ setOpenDrawer, openDrawer }) {
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
          sx={{ width: 40, marginRight: 2 }}
        />
        <Typography ml={2} variant="h6" noWrap component="div">
          Clube Pro - Cotações
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default LayoutAppBar;
