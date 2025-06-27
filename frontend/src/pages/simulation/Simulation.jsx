import { Box } from "@mui/material";
import SimulationContent from "@/components/Simulation/SimulationContent.jsx";
import SimulationSideBar from "@/components/Simulation/SimulationSideBar.jsx";
import { SimulationProvider } from "@/contexts/SimulationContext.jsx";
import PageTitle from "@/components/PageTitle/PageTitle.jsx";

function Simulation() {
  return (
    <SimulationProvider>
      <Box padding={3}>
        <PageTitle title="Cotação" />
        <Box mt={2} sx={{ display: "flex", gap: 2 }}>
          <SimulationContent />
          <SimulationSideBar />
        </Box>
      </Box>
    </SimulationProvider>
  );
}

export default Simulation;
