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
import { ExitToApp, ExpandLess, ExpandMore } from "@mui/icons-material";
import { AuthContext } from "@/contexts/authContext";
import { useContext, useState } from "react";

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
                const hasChildren =
                  Array.isArray(children) && children.length > 0;
                const [openCollapse, setOpenCollapse] = useState(false);

                if (hasChildren) {
                  return (
                    <Box key={label}>
                      <ListLink
                        key={path}
                        path={path}
                        Icon={Icon}
                        title={label}
                        onClick={() => setOpenCollapse(!openCollapse)}
                      >
                        {openCollapse ? <ExpandLess /> : <ExpandMore />}
                      </ListLink>
                      <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        {children.map(
                          ({ path: subPath, icon: Icon, label: subLabel }) => (
                            <ListLink
                              key={subPath}
                              path={subPath}
                              Icon={Icon}
                              title={subLabel}
                            />
                          )
                        )}
                      </Collapse>
                    </Box>
                  );
                }
                return (
                  <ListLink key={path} path={path} Icon={Icon} title={label} />
                );
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
          <Divider className="w-100 " />
          <Typography className="pt-3">
            Logout <ExitToApp className="ms-3" />
          </Typography>
        </Stack>
      </Stack>
    </Drawer>
  );
}

export default AppDrawer;
