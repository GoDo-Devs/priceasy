import { createTheme } from "@mui/material/styles";

const NAVY_DEEP = "#0F1E33";
const NAVY_SURFACE = "#16263F";
const NAVY_CARD = "#1F3A5C";
const BORDER = "#2C4A6B";
const BLUE = "#2A9FD6";
const SAGE = "#7FC9A8";
const TEXT = "#EAF0F6";
const TEXT_DIM = "#A9BBD0";

const bodyFont = '"Inter", system-ui, -apple-system, sans-serif';
const displayFont = '"Sora", "Inter", system-ui, sans-serif';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: BLUE,
      light: "#5FBDE6",
      dark: "#1B6FA0",
      contrastText: NAVY_DEEP,
    },
    background: {
      main: NAVY_CARD,
      paper: NAVY_SURFACE,
      default: NAVY_DEEP,
    },
    secondary: {
      main: SAGE,
      light: "#A6DCC4",
      dark: "#579B7E",
      contrastText: NAVY_DEEP,
    },
    success: {
      main: SAGE,
    },
    text: {
      primary: TEXT,
      secondary: TEXT_DIM,
    },
    divider: BORDER,
    defaultBg: {
      main: NAVY_SURFACE,
      light: NAVY_CARD,
      dark: NAVY_DEEP,
      cardBg: NAVY_SURFACE,
      contrastText: TEXT,
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: displayFont, fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: displayFont, fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontFamily: displayFont, fontWeight: 600, letterSpacing: "-0.015em" },
    h4: { fontFamily: displayFont, fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontFamily: displayFont, fontWeight: 600 },
    h6: { fontFamily: displayFont, fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
    overline: { letterSpacing: "0.08em", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFeatureSettings: '"cv05", "ss01"',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: NAVY_DEEP,
          backgroundImage: "none",
          borderBottom: `1px solid ${BORDER}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: NAVY_DEEP,
          backgroundImage: "none",
          borderRight: `1px solid ${BORDER}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: NAVY_CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
          paddingBlock: 8,
        },
        containedPrimary: {
          "&:hover": { backgroundColor: "#5FBDE6" },
        },
        containedSecondary: {
          "&:hover": { backgroundColor: "#A6DCC4" },
        },
        outlined: {
          borderColor: BORDER,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: BORDER,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3A5F88",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: BLUE,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: BORDER,
        },
        head: {
          color: TEXT_DIM,
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: 12,
          letterSpacing: "0.05em",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
  },
});

export default theme;
