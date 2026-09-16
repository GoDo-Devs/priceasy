import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#2A9FD6",
      light: "#5FBDE6",
      dark: "#1B6FA0",
      contrastText: "#0F1E33",
    },
    background: {
      main: "#1F3A5C",
      paper: "#16263F",
      default: "#0F1E33",
    },
    secondary: {
      main: "#7FC9A8",
      light: "#A6DCC4",
      dark: "#579B7E",
      contrastText: "#0F1E33",
    },
    success: {
      main: "#7FC9A8",
    },
    text: {
      primary: "#EAF0F6",
      secondary: "#A9BBD0",
    },
    divider: "#2C4A6B",
    defaultBg: {
      main: "#16263F",
      light: "#1F3A5C",
      dark: "#0F1E33",
      cardBg: "#16263F",
      contrastText: "#EAF0F6",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2C4A6B",
          },
        },
      },
    },
  },
});

export default theme;
