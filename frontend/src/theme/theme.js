import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#1894c3",
    },
    background: {
      main: "#4d566b",
      paper: "#1a1d24",
      default: "#120815",
    },
    secondary: {
      main: "#51d6a4",
    },
    success: {
      main: "#51d6a4",
    },
    defaultBg: {
      main: "#1a1d24",
      light: "#1a1d24",
      dark: "#1a1d24",
      contrastText: "#fff",
    },
  },
});

export default theme;
