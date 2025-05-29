import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  Stack,
  Collapse,
} from "@mui/material";
import { guardedAuthenticatedRoutes } from "@/router/routes.js";
import ListLink from "../components/DrawerLinks/ListLink.jsx";
import { ExitToApp } from "@mui/icons-material";
import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import GroupLink from "../components/DrawerLinks/GroupLink.jsx";

function AppDrawer({ open, drawerWidth, isMobile, setOpenDrawer }) {
  const { handleLogout } = useContext(AuthContext);

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      sx={{
        width: open && drawerWidth,
      }}
      onClose={() => setOpenDrawer(false)}
    >
      <Stack width={drawerWidth} height="100vh" overflow="hidden">
        <Box className="ps-1">
          <Toolbar />
          <Divider />
          <List>
            {guardedAuthenticatedRoutes[0].children.map(
              ({ path, icon: Icon, label, children }) => {
                return children
                      ? <GroupLink key={label} path={path} Icon={Icon} title={label} children={children} />
                      : <ListLink key={label} path={path} Icon={Icon} title={label} />
              }
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
