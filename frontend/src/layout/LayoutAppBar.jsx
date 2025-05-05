import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

function LayoutAppBar() {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: "9999" }}
      color='defaultBg'
      elevation={0}
      enableColorOnDark
  >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
  )
}

export default LayoutAppBar