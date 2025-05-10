import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { protectedRoutes } from '@/router/routes.js'

function AppDrawer({open, drawerWidth}) {
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{width: open ? drawerWidth : 0}}
    >
      <Toolbar />
      <Divider />
      <List>
        {protectedRoutes.map(({ path, icon: Icon, label }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton component={NavLink} to={path}>
              <ListItemIcon>{Icon && <Icon color="primary" />}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default AppDrawer