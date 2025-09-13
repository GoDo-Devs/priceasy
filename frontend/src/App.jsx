import { RouterProvider } from "react-router";
import routes from "./router/routes";
import { SimulationProvider } from "@/contexts/simulationContext.jsx";
import { SnackbarProvider } from "@/contexts/snackbarContext.jsx";
import "@/theme/app.css";

function App() {
  return (
    <SimulationProvider>
      <SnackbarProvider>
        <RouterProvider router={routes} />
      </SnackbarProvider>
    </SimulationProvider>
  );
}

export default App;
