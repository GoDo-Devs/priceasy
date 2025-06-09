import { useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import TextInput from "@/components/Form/TextInput.jsx";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import SelectDataTable from "@/components/Table/SelectDataTable.jsx";
import useHttp from "@/services/useHttp.js";

function PlanAdd() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, filteredCoverage, filteredAssistance, services } =
    useColumnsService();
  const [plan, setPlan] = useState({ name: "", price: "" });
  const [coverageSelection, setCoverageSelection] = useState({});
  const [assistanceSelection, setAssistanceSelection] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id || !services.length) return;

    let mounted = true;

    const fetchPlan = async () => {
      try {
        const responsePlan = await useHttp.get(`/plans/${id}`);
        const responsePlanServices = await useHttp.get(`/plan-services/${id}`);

        if (!mounted) return;

        setPlan({
          name: responsePlan.data.name,
          price: responsePlan.data.price,
        });

        const selectedCoverage = {};
        const selectedAssistance = {};

        responsePlanServices.data.forEach((serviceId) => {
          const service = services.find((s) => s.id === serviceId);
          if (!service) return;
          if (service.category_id === 1) {
            selectedCoverage[serviceId.toString()] = true;
          } else if (service.category_id === 2) {
            selectedAssistance[serviceId.toString()] = true;
          }
        });

        setCoverageSelection(selectedCoverage);
        setAssistanceSelection(selectedAssistance);
      } catch (error) {
        console.error("Erro ao carregar plano:", error);
      }
    };

    fetchPlan();

    return () => {
      mounted = false;
    };
  }, [id, services]);

  const selectedCoverage = filteredCoverage.filter(
    (s) => coverageSelection[s.id.toString()]
  );
  const selectedAssistance = filteredAssistance.filter(
    (s) => assistanceSelection[s.id.toString()]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...plan,
        services_id: [...selectedCoverage, ...selectedAssistance].map(
          (s) => s.id
        ),
      };

      if (id) {
        await useHttp.patch(`/plans/edit/${id}`, payload);
        console.log("Plano atualizado:", payload);
      } else {
        await useHttp.post("/plans/create/", payload);
        console.log("Plano criado:", payload);
      }
      navigate("/planos");
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
        title="Selecione todas as coberturas oferecidas neste plano"
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
          {id ? "Atualizar Plano" : "Salvar Plano"}
        </Button>
      </Box>
    </Box>
  );
}

export default PlanAdd;
