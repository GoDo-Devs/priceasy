import React, { useContext, useEffect } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { AuthContext } from "@/contexts/authContext";
import ListLink from "../components/DrawerLinks/ListLink.jsx";
import GroupLink from "../components/DrawerLinks/GroupLink.jsx";
import { guardedAuthenticatedRoutes } from "@/router/routes.js";

function canAccess(route, user) {
  if (!route.guard) return true;
  return route.guard.every((fn) => fn(user));
}

function AppDrawer({ open, drawerWidth, isMobile, setOpenDrawer }) {
  const { handleLogout, user } = useContext(AuthContext);

  useEffect(() => {
    const handleGlobalCloseDrawer = () => {
      setOpenDrawer(false);
    };

    window.addEventListener("closeDrawer", handleGlobalCloseDrawer);

    return () => {
      window.removeEventListener("closeDrawer", handleGlobalCloseDrawer);
    };
  }, [setOpenDrawer]);

  const filteredRoutes = guardedAuthenticatedRoutes[0].children
    .filter((route) => canAccess(route, user))
    .map((route) => {
      if (route.children) {
        return {
          ...route,
          children: route.children.filter((child) => canAccess(child, user)),
        };
      }
      return route;
    });

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      sx={{ width: open ? drawerWidth : 0 }}
      onClose={() => setOpenDrawer(false)}
    >
      <Stack width={drawerWidth} height="100vh" overflow="hidden">
        <Box className="ps-1">
          <Toolbar />
          <Divider />
          <List>
            {filteredRoutes.map(({ path, icon: Icon, label, children }) =>
              children ? (
                <GroupLink
                  key={label}
                  path={path}
                  Icon={Icon}
                  title={label}
                  children={children}
                />
              ) : (
                <ListLink key={label} path={path} Icon={Icon} title={label} />
              )
            )}
          </List>
        </Box>
        <Stack
          className="mt-auto pb-5 hoverable"
          alignItems="center"
          justifyContent="center"
          onClick={handleLogout}
        >
          <Divider className="w-100" />
          <Typography className="pt-3">
            Logout <ExitToApp className="ms-3" />
          </Typography>
        </Stack>
      </Stack>
    </Drawer>
  );
}

export default AppDrawer;
