import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#1894c3",
    },
    background: {
      main: "#4d566b",
      paper: "#1D1420",
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
      cardBg: "#1D1420",
      contrastText: "#fff",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#69696acd", 
          }
        },
      },
    },
  },
});

export default theme;
