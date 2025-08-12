import { RouterProvider } from "react-router";
import routes from "./router/routes";
import { SimulationProvider } from "@/contexts/simulationContext.jsx";
import '@/theme/app.css';

function App() {
  return (
    <SimulationProvider>
      <RouterProvider router={routes} />
    </SimulationProvider>
  );
}

export default App;
