import { Box, Typography, Button, Collapse } from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import AggregatesForm from "@/components/Form/AggregatesForm.jsx";
import { useState, useEffect } from "react";
import vehicleTypeService from "@/services/vehicleTypeService.js";

function Aggregates({ simulation, setSimulation, onDetails, plans }) {
  const [showForm, setShowForm] = useState(false);
  const [aggregateQty, setAggregateQty] = useState(0);

  useEffect(() => {
    if (!simulation?.vehicle_type_id) {
      setShowForm(false);
      setAggregateQty(0);
      return;
    }

    vehicleTypeService
      .getById(simulation.vehicle_type_id)
      .then((data) => {
        const qty = data.aggregate ?? 0;
        setAggregateQty(qty);

        if (
          qty === 0 &&
          (!simulation.aggregates || simulation.aggregates.length === 0)
        ) {
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      })
      .catch((err) => console.error("Error fetching vehicle type:", err));
  }, [simulation?.vehicle_type_id]);

  const hasSimulationAggregates =
    Array.isArray(simulation?.aggregates) && simulation.aggregates.length > 0;

  const canAddAggregate = Boolean(simulation.vehicle_type_id);
  const shouldShowForm =
    showForm || hasSimulationAggregates || aggregateQty > 0;

  useEffect(() => {
    if (hasSimulationAggregates || aggregateQty > 0) {
      setShowForm(true);
    }
  }, [hasSimulationAggregates, aggregateQty]);

  const renderPlaceholder = (message, disableButton = false) => (
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
        <Typography color="text.secondary" fontStyle="italic">
          {message}
        </Typography>
      </Box>
      <Button
        variant={disableButton ? "outlined" : "contained"}
        color="primary"
        size="medium"
        onClick={() => setShowForm(true)}
        disabled={disableButton}
      >
        Adicionar
      </Button>
    </Box>
  );

  return (
    <Box bgcolor="#1D1420" borderRadius={2} padding={2.25} mt={2}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Agregados
      </Typography>

      <Collapse in={shouldShowForm} timeout={300}>
        {shouldShowForm && canAddAggregate ? (
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
        ) : null}
      </Collapse>

      {!shouldShowForm &&
        !canAddAggregate &&
        renderPlaceholder(
          "Selecione o tipo de veículo para adicionar agregados",
          true
        )}

      {!shouldShowForm &&
        canAddAggregate &&
        !hasSimulationAggregates &&
        renderPlaceholder("Nenhum agregado cadastrado")}
    </Box>
  );
}

export default Aggregates;
