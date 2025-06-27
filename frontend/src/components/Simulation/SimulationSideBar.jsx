import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { Box } from "@mui/material";

function SimulationSideBar() {
  const { simulation, setSimulation } = useSimulation();

  return (
    <Box
      sx={{
        width: "30%",
        height: "auto",
        borderRadius: "8px",
        overflowY: "auto",
        background:"#1D1420",
      }}
    ></Box>
  );
}

export default SimulationSideBar;
