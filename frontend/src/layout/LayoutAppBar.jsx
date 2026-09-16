import { AppBar, IconButton, Toolbar, Box, Typography } from "@mui/material";
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
      <Toolbar sx={{ gap: 1.5, minHeight: 68 }}>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)} edge="start">
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ width: 52 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "-0.01em",
              color: "text.primary",
            }}
          >
            Club Pró+
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Cotações
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default LayoutAppBar;
