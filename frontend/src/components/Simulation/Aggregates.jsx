import { Box, Typography, Button, Collapse } from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import AggregatesForm from "@/components/Form/AggregatesForm.jsx";
import { useState, useEffect } from "react";
import vehicleTypeService from "@/services/vehicleTypeService.js";
import PlanSelectorAggregates from "@/components/Simulation/PlanSelectorAggregates.jsx";

function Aggregates({ simulation, setSimulation, onDetails, plans }) {
  const [showForm, setShowForm] = useState(false);
  const [aggregateQty, setAggregateQty] = useState(0);

  useEffect(() => {
    if (!simulation?.vehicle_type_id) return;
    vehicleTypeService
      .getById(simulation.vehicle_type_id)
      .then((data) => setAggregateQty(data.aggregate ?? 0))
      .catch((err) => console.error("Error fetching vehicle type:", err));
  }, [simulation?.vehicle_type_id]);

  const hasSimulationAggregates = simulation?.aggregates?.length > 0;
  const shouldShowForm =
    showForm || aggregateQty > 0 || hasSimulationAggregates;

  return (
    <Box bgcolor="#1D1420" borderRadius={2} padding={2.25} mt={2}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Agregados
      </Typography>

      <Collapse in={shouldShowForm} timeout={300}>
        {shouldShowForm && (
          <Box display="flex" flexDirection="column" gap={1}>
            <AggregatesForm
              simulation={simulation}
              setSimulation={setSimulation}
              aggregateQty={aggregateQty}
              plans={plans}
              onDetails={onDetails}
              onEmpty={() => {
                setShowForm(false);
                setAggregateQty(0);
              }}
            />
            
          </Box>
        )}
      </Collapse>

      <Collapse in={!shouldShowForm} timeout={300}>
        {!shouldShowForm && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            mt={1}
            borderRadius={2}
            padding={1.5}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <SubtitlesIcon fontSize="small" sx={{ color: "white" }} />
              <Typography fontStyle="italic" color="text.secondary">
                Nenhum agregado cadastrado.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => setShowForm(true)}
            >
              Adicionar
            </Button>
          </Box>
        )}
      </Collapse>
    </Box>
  );
}

export default Aggregates;
