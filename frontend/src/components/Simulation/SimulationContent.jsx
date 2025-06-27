import {
  Box,
  Typography,
  Radio,
  FormGroup,
  Button,
  Grid,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import TextInput from "@/components/Form/TextInput.jsx";
import CurrencyInput from "../Form/CurrencyInput.jsx";
import SelectInput from "@/components/Form/SelectInput.jsx";
import AutoCompleteInput from "@/components/Form/AutoCompleteInput.jsx";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import PlanDetailsModal from "@/components/Modal/PlanDetailsModal.jsx";
import AddImplementSimulation from "../Modal/AddImplementSimulation.jsx";

import ImplementTable from "@/components/Simulation/ImplementTable.jsx";
import PlanSelector from "@/components/Simulation/PlanSelector.jsx";

function SimulationContent() {
  const { client, setClient, simulation, setSimulation } = useSimulation();
  const { vehicleType, brand, model, year, priceTableNames, plans } =
    useSimulationEffects();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [implementModalOpen, setImplementModalOpen] = useState(false);

  const handleSaveMonthlyFee = (monthlyFee, selectedProducts, planId) => {
    setSimulation((prev) => ({
      ...prev,
      monthlyFee,
      selectedProducts,
      planId,
    }));
  };

  console.log(client);

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        overflowY: "auto",
      }}
    >
      <Box bgcolor="#1D1420" borderRadius={2} padding={2.5}>
        <Grid container spacing={2}>
          <Grid item size={3.2}>
            <TextInput
              fullWidth
              label="Nome"
              name="name"
              value={client.name ?? ""}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item size={2}>
            <TextInput
              fullWidth
              label="CPF"
              name="cpf"
              value={client.cpf ?? ""}
              onChange={(e) => setClient({ ...client, cpf: e.target.value })}
              required
            />
          </Grid>
          <Grid item size={2}>
            <TextInput
              fullWidth
              label="Celular"
              name="phone"
              value={client.phone ?? ""}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              required
            />
          </Grid>
          <Grid item size={2}>
            <SelectInput
              fullWidth
              label="Tipo Veículo"
              name="vehicle_type_id"
              value={simulation.vehicle_type_id ?? ""}
              onChange={(e) =>
                setSimulation({
                  ...simulation,
                  vehicle_type_id: parseInt(e.target.value),
                  brand: "",
                  model: "",
                  year: "",
                })
              }
              options={vehicleType.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Grid>
          <Grid item size={2.8}>
            <AutoCompleteInput
              fullWidth
              label="Marca"
              value={simulation.brand}
              options={brand}
              onChange={(val) =>
                setSimulation({
                  ...simulation,
                  brand: val,
                  model: "",
                  year: "",
                })
              }
            />
          </Grid>
          <Grid item size={5}>
            <AutoCompleteInput
              fullWidth
              label="Modelo"
              value={simulation.model_id}
              options={model}
              onChange={(val) =>
                setSimulation({
                  ...simulation,
                  model_id: val,
                  year: "",
                  price_table_id: null,
                  plan_id: null,
                })
              }
            />
          </Grid>
          <Grid item size={2.2}>
            <AutoCompleteInput
              fullWidth
              label="Ano Modelo"
              value={simulation.year}
              options={year}
              onChange={(val) =>
                setSimulation({
                  ...simulation,
                  year: val,
                })
              }
            />
          </Grid>
          <Grid item size={2.5}>
            <AutoCompleteInput
              fullWidth
              label="Tabela de Preço"
              value={simulation.price_table_id}
              options={priceTableNames}
              onChange={(val) =>
                setSimulation({
                  ...simulation,
                  price_table_id: val,
                })
              }
            />
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" flexDirection="column">
              <InputLabel
                variant="caption"
                color="textSecondary"
                sx={{ mb: 0.5 }}
              >
                Valor Fipe
              </InputLabel>
              <Typography
                variant="body1"
                sx={{
                  padding: "10.5px 14px",
                }}
              >
                {simulation.fipeValue}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <InputLabel className="mb-1">Valor Protegido</InputLabel>
            <CurrencyInput
              fullWidth
              name="protectedValue"
              value={
                simulation.protectedValue ??
                (simulation.fipeValue
                  ? Number(simulation.fipeValue).toFixed(2)
                  : "")
              }
              onChange={(floatValue) =>
                setSimulation({
                  ...simulation,
                  protectedValue: floatValue ?? "",
                })
              }
              required
            />
          </Grid>
        </Grid>
      </Box>
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
        onSave={handleSaveMonthlyFee}
      />
    </Box>
  );
}

export default SimulationContent;
