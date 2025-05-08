import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import React from 'react'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import routes from '@/router/routes';

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
        {['home'].map((text, index) => (
          <ListItem text key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon  color='primary' /> : <MailIcon color='primary' />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default AppDrawer