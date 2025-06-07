import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import TextInput from "@/components/Form/TextInput.jsx";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import SelectDataTable from "@/components/Table/SelectDataTable.jsx";
import useHttp from "@/services/useHttp.js";

function PlanAdd() {
  const navigate = useNavigate();
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, filteredCoverage, filteredAssistance } = useColumnsService();
  const [plan, setPlan] = useState({name: "", services_id: "" });
  const [coverageSelection, setCoverageSelection] = useState({});
  const [assistanceSelection, setAssistanceSelection] = useState({});
  const selectedCoverage = Object.keys(coverageSelection).map(
    (key) => filteredCoverage[key]
  );
  const selectedAssistance = Object.keys(assistanceSelection).map(
    (key) => filteredAssistance[key]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await useHttp.post("/plans/create/", {
        ...plan,
        services_id: [...selectedCoverage, ...selectedAssistance].map((s) => s.id)
      });
      console.log("Plano criado:", plan);
      navigate("/planos")
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
        rowSelection={coverageSelection}
        onRowSelectionChange={setCoverageSelection}
      />
      <SelectDataTable
        columns={columns}
        data={filteredAssistance}
        title="Selecione as assistências 24 horas oferecidas neste plano"
        rowSelection={assistanceSelection}
        onRowSelectionChange={setAssistanceSelection}
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={handleSubmit} variant="contained" color="secondary">
          Salvar Plano
        </Button>
      </Box>
    </Box>
  );
}

export default PlanAdd;
