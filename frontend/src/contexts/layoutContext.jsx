import { createContext, useState, useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

export const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [drawerWidth, setDrawerWidth] = useState(230);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const theme = useTheme();
  const isMdOrUp = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    setIsMobile(!isMdOrUp);
    setOpenDrawer(isMdOrUp);
  }, [isMdOrUp]);

  const value = {
    drawerWidth: openDrawer ? drawerWidth : 0,
    setDrawerWidth,
    openDrawer,
    setOpenDrawer,
    isMobile,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}