import { AppBar, IconButton, Toolbar, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function LayoutAppBar({ setOpenDrawer, openDrawer }) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
      </Toolbar>
    </AppBar>
  );
}

export default LayoutAppBar;
