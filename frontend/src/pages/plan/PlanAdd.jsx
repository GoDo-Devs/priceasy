import { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import TextInput from "@/components/Form/TextInput.jsx";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import SelectDataTable from "@/components/Table/SelectDataTable.jsx";
import useHttp from "@/services/useHttp.js";

function PlanAdd() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, services } = useColumnsService();
  const filteredCoverage = services.filter((item) => item.category_id === 1);
  const filteredAssistance = services.filter((item) => item.category_id === 2);
  const [plan, setPlan] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/plans/create/", {
        ...plan,
        vehicle_type_ids: vehicleTypes.selected,
      });
      console.log("Plano criado:", plan);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar o plano:", error);
    }
  };

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px",
      }}
    >
      <Box display="flex" gap={2} mb={3}>
        <TextInput
          label="Nome do Plano"
          name="name"
          value={plan.name}
          onChange={(e) => setPlan({ ...plan, name: e.target.value })}
          required
          fullWidth
        />
      </Box>
      <SelectDataTable
        columns={columns}
        data={filteredCoverage}
        title="Selecione todas as coberturas oferecidas neste planos"
      />
      <SelectDataTable
        columns={columns}
        data={filteredAssistance}
        title="Selecione as assistências 24 horas oferecidas neste plano"
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Salvar Plano
        </Button>
      </Box>
    </Box>
  );
}

export default PlanAdd;
