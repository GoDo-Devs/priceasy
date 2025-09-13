import { Box, CircularProgress, Grid } from "@mui/material";
import SimulationContent from "@/components/Simulation/SimulationContent.jsx";
import SimulationSideBar from "@/components/Simulation/SimulationSideBar.jsx";
import { SimulationProvider } from "@/contexts/simulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import { useEffect } from "react";

function SimulationInner() {
  const { loading } = useSimulationEffects();

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("closeDrawer"));
    }, 100);
  }, []);

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
    <Box p={2.5}>
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <Grid size={{ xs: 12, md: 9 }}>
            <SimulationContent />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
            <SimulationSideBar />
        </Grid>
      </Grid>
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
