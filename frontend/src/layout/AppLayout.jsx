import React, { useState } from 'react'
import { Outlet } from 'react-router'
import AppDrawer from './AppDrawer'
import { Box, Container } from '@mui/material'
import LayoutAppBar from './LayoutAppBar'

function AppLayout() {
  const [drawerWidth, setDrawerWidth] = useState(175);
  const [openDrawer, setOpenDrawer] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
        <LayoutAppBar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
        <AppDrawer open={openDrawer} drawerWidth={drawerWidth} setDrawerWidth={setDrawerWidth}  />
        <div
            className='mt-15'
            component="main"
        >
        <Outlet />
      </div>
    </Box>
  )
}

export default AppLayout