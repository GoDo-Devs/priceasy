import {
  RouterProvider,
} from "react-router";
import routes from "./router/routes";
import { Card } from "@mui/material";
import { AuthProvider } from "./contexts/authContext";


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  )
}

export default App
