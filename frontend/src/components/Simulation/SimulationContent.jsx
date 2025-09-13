import { Box } from "@mui/material";
import { useState } from "react";
import { useSimulation } from "@/contexts/simulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import PlanDetailsModal from "@/components/Modal/PlanDetailsModal.jsx";

import ClientVehicleForm from "@/components/Simulation/ClientVehicleForm.jsx";
import Aggregates from "@/components/Simulation/Aggregates.jsx";
import PlanSelector from "@/components/Simulation/PlanSelector.jsx";

function SimulationContent() {
  const { simulation, setSimulation, priceOptions } = useSimulation();
  const {
    vehicleType,
    brand,
    model,
    year,
    priceTableNames,
    plans: simulationPlans,
    client,
  } = useSimulationEffects();

  const [selectedPlanSimulation, setSelectedPlanSimulation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSavePlanDetails = ({
    planId,
    monthlyFee,
    valueSelectedProducts,
    selectedProducts,
  }) => {
    setSimulation((prev) => ({
      ...prev,
      plan_id: planId,
      selectedProducts,
      monthlyFee,
      valueSelectedProducts,
    }));
  };

  return (
    <Box>
      <ClientVehicleForm
        vehicleType={vehicleType}
        brand={brand}
        model={model}
        year={year}
        priceTableNames={priceTableNames}
      />
      <PlanSelector
        plans={simulationPlans}
        simulation={simulation}
        setSimulation={setSimulation}
        onDetails={(plan) => {
          setSelectedPlanSimulation(plan);
          setModalOpen(true);
        }}
      />
      <Aggregates
        simulation={simulation}
        setSimulation={setSimulation}
      />
      <PlanDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlanSimulation}
        simulation={simulation}
        selectedProductsProp={simulation.selectedProducts}
        onSave={handleSavePlanDetails}
      />
    </Box>
  );
}

export default SimulationContent;
