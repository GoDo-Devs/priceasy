import { Box } from "@mui/material";
import { useState } from "react";
import SimulationContent from "@/components/Simulation/SimulationContent";
import SimulationSideBar from "@/components/Simulation/SimulationSideBar";

function Simulation() {
  const [simulation, setSimulation] = useState({});
  const [client, setClient] = useState({});
  const [priceTable, setPriceTable] = useState({});

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <SimulationContent
        client={client}
        setClient={setClient}
        simulation={simulation}
        setSimulation={setSimulation}
        priceTable={priceTable}
      />
      <SimulationSideBar
        simulation={simulation}
        setSimulation={setSimulation}
      />
    </Box>
  );
}

export default Simulation;
