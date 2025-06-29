import { Box } from "@mui/material";
import { useState } from "react";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import PlanDetailsModal from "@/components/Modal/PlanDetailsModal.jsx";
import AddImplementSimulation from "@/components/Modal/AddImplementSimulation.jsx";

import ClientVehicleForm from "@/components/Simulation/ClientVehicleForm.jsx";
import ImplementTable from "@/components/Simulation/ImplementTable.jsx";
import PlanSelector from "@/components/Simulation/PlanSelector.jsx";

function SimulationContent() {
  const { simulation, setSimulation } = useSimulation();
  const { plans } = useSimulationEffects();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [implementModalOpen, setImplementModalOpen] = useState(false);

  const handleSavePlanDetails = (monthlyFee, selectedProducts, planId) => {
    setSimulation((prev) => ({
      ...prev,
      plan_id: planId,
      selectedProducts,
      monthlyFee,
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        overflowY: "auto",
      }}
    >
      <ClientVehicleForm />
      <PlanSelector
        plans={plans}
        simulation={simulation}
        setSimulation={setSimulation}
        onDetails={(plan) => {
          setSelectedPlan(plan);
          setModalOpen(true);
        }}
      />
      <ImplementTable
        implementList={simulation.implementList}
        onAdd={() => setImplementModalOpen(true)}
      />
      <AddImplementSimulation
        open={implementModalOpen}
        onClose={() => setImplementModalOpen(false)}
        simulation={simulation}
        setSimulation={setSimulation}
      />
      <PlanDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlan}
        simulation={simulation}
        onSave={handleSavePlanDetails}
      />
    </Box>
  );
}

export default SimulationContent;
