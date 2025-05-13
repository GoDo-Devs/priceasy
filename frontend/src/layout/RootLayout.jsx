import { AuthProvider } from "../contexts/authContext";
import { LayoutProvider } from "../contexts/layoutContext";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <LayoutProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </LayoutProvider>
  );
}

export default RootLayout;
