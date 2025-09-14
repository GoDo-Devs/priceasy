import { Box } from "@mui/material";
import { useState } from "react";
import { useSimulation } from "@/contexts/simulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import PlanDetailsModal from "@/components/Modal/PlanDetailsModal.jsx";
import PlanDetailsModalAggregates from "@/components/Modal/PlanDetailsModalAggregates.jsx";
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
  } = useSimulationEffects();

  const [selectedPlanSimulation, setSelectedPlanSimulation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAggregate, setSelectedAggregate] = useState(null);
  const [modalOpenAggregate, setModalOpenAggregate] = useState(false);

  const aggregatePlans = Object.fromEntries(
    Object.entries(priceOptions || {}).map(([aggId, aggData]) => [
      aggId,
      aggData.plans || [],
    ])
  );

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

  const handleSaveAggregateDetails = ({
    key,
    planId,
    basePrice,
    selectedProducts,
    valueSelectedProducts,
  }) => {
    const newBasePrice = Number(basePrice) + Number(valueSelectedProducts || 0);

    setSimulation((prev) => ({
      ...prev,
      aggregates: prev.aggregates.map((agg) =>
        agg.key === key
          ? {
              ...agg,
              planId,
              selectedProducts,
              valueSelectedProducts,
              basePrice: newBasePrice,
              _manualBasePrice: newBasePrice, 
            }
          : agg
      ),
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
        plans={aggregatePlans}
        simulation={simulation}
        setSimulation={setSimulation}
        onDetails={(aggregate) => {
          const aggregateWithSelected = {
            ...aggregate,
            selectedProducts:
              aggregate.selectedProducts ||
              simulation.aggregates.find((a) => a.key === aggregate.key)
                ?.selectedProducts ||
              {},
          };
          setSelectedAggregate(aggregateWithSelected);
          setModalOpenAggregate(true);
        }}
      />

      <PlanDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={selectedPlanSimulation}
        simulation={simulation}
        onSave={handleSavePlanDetails}
      />

      {selectedAggregate && (
        <PlanDetailsModalAggregates
          open={modalOpenAggregate}
          onClose={() => setModalOpenAggregate(false)}
          plan={selectedAggregate}
          onSave={handleSaveAggregateDetails}
        />
      )}
    </Box>
  );
}

export default SimulationContent;
