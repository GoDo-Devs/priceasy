import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import PlanDetailsModal from "@/components/Modal/PlanDetailsModal.jsx";
import AddImplementSimulation from "@/components/Modal/AddImplementSimulation.jsx";

import ClientVehicleForm from "@/components/Simulation/ClientVehicleForm.jsx";
import ImplementTable from "@/components/Simulation/ImplementTable.jsx";
import PlanSelector from "@/components/Simulation/PlanSelector.jsx";

function SimulationContent() {
  const { simulation, setSimulation } = useSimulation();

  const { vehicleType, brand, model, year, priceTableNames, plans, client } =
    useSimulationEffects();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [implementModalOpen, setImplementModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSavePlanDetails = (monthlyFee, selectedProducts, planId) => {
    setSimulation((prev) => ({
      ...prev,
      plan_id: planId,
      selectedProducts,
      monthlyFee,
    }));
  };

  const handleEditImplement = (item) => {
    setEditingItem(item);
    setImplementModalOpen(true);
  };

  const handleDeleteImplement = (item) => {
    const updatedList = simulation.implementList.filter(
      (i) => i.id !== item.id
    );
    setSimulation({ ...simulation, implementList: updatedList });
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
        onAdd={() => {
          setEditingItem(null);
          setImplementModalOpen(true);
        }}
        onEdit={handleEditImplement}
        onDelete={handleDeleteImplement}
      />
      <AddImplementSimulation
        open={implementModalOpen}
        onClose={() => {
          setImplementModalOpen(false);
          setEditingItem(null);
        }}
        simulation={simulation}
        setSimulation={setSimulation}
        editingItem={editingItem}
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
