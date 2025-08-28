import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Box, Button, CircularProgress } from "@mui/material";
import TextInput from "@/components/Form/TextInput.jsx";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import SelectDataTable from "@/components/Table/SelectDataTable.jsx";
import useHttp from "@/services/useHttp.js";
import { useSnackbar } from "@/contexts/snackbarContext.jsx";

function PlanAdd() {
  const { columns, filteredCoverage, filteredAssistance, services } =
    useColumnsService();
  const [plan, setPlan] = useState({ name: "", price: "" });
  const [coverageSelection, setCoverageSelection] = useState({});
  const [assistanceSelection, setAssistanceSelection] = useState({});
  const [loadingPlan, setLoadingPlan] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (!id || !services.length) return;

    let mounted = true;

    const fetchPlan = async () => {
      setLoadingPlan(true);
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

        responsePlanServices.data.forEach((planService) => {
          const fullService = services.find((s) => s.id === planService.id);
          if (!fullService) return;

          if (fullService.category_id === 1) {
            selectedCoverage[fullService.id.toString()] = true;
          } else if (fullService.category_id === 2) {
            selectedAssistance[fullService.id.toString()] = true;
          }
        });

        setCoverageSelection(selectedCoverage);
        setAssistanceSelection(selectedAssistance);
      } catch (error) {
        console.error("Erro ao carregar plano:", error);
      } finally {
        setLoadingPlan(false);
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
        const res = await useHttp.patch(`/plans/edit/${id}`, payload);
        console.log("Plano atualizado:", payload);
        showSnackbar(res.data.message, "success");
      } else {
        const res = await useHttp.post("/plans/create/", payload);
        console.log("Plano criado:", payload);
        showSnackbar(res.data.message, "success");
      }
      navigate("/planos");
    } catch (error) {
      const msg = error.response?.data?.message;
      showSnackbar(msg, "error");
      console.error("Erro ao salvar o plano:", error);
    }
  };

  return (
    <Box padding={3}>
      {loadingPlan ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="75vh"
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <>
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
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
            >
              {id ? "Atualizar Plano" : "Salvar Plano"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default PlanAdd;
