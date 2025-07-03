import { Box, CircularProgress } from "@mui/material";
import SimulationContent from "@/components/Simulation/SimulationContent.jsx";
import SimulationSideBar from "@/components/Simulation/SimulationSideBar.jsx";
import { SimulationProvider } from "@/contexts/SimulationContext.jsx";
import PageTitle from "@/components/PageTitle/PageTitle.jsx";

import useSimulationEffects from "@/hooks/useSimulationEffects.js";

function SimulationInner() {
  const { loading } = useSimulationEffects();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="75vh"
      >
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <PageTitle title="Cotação" />
      <Box mt={2} sx={{ display: "flex", gap: 2 }}>
        <SimulationContent />
        <SimulationSideBar />
      </Box>
    </Box>
  );
}

export default function Simulation() {
  return (
    <SimulationProvider>
      <SimulationInner />
    </SimulationProvider>
  );
}
