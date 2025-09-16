  import { Box, Typography, Button, Radio, FormGroup } from "@mui/material";
  import SubtitlesIcon from "@mui/icons-material/Subtitles";

  function PlanSelector({ plans, simulation, setSimulation, onDetails }) {
    const noTable = !simulation.price_table_id;
    const noPlans = plans.length === 0;

    const formatBRL = (value) => {
      const num = Number(value);
      if (isNaN(num)) return "-";
      return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    if (noTable || noPlans) {
      return (
        <Box bgcolor="#1D1420" borderRadius={2} padding={2.25} mt={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Planos
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={1}
            borderRadius={2}
            padding={1.5}
          >
            <SubtitlesIcon fontSize="small" sx={{ color: "white" }} />
            <Typography fontStyle="italic" color="text.secondary">
              Nenhum plano encontrado para este veículo
            </Typography>
          </Box>
        </Box>
      );
    }

    const handleSelectPlan = (plan) => {
      setSimulation((prev) => ({
        ...prev,
        plan_id: plan.id,
        monthlyFee: plan.basePrice,
        selectedProducts: {},
        valueSelectedProducts: 0, 
      }));
    };

    return (
      <Box bgcolor="#1D1420" borderRadius={2} padding={2} mt={2}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Planos
        </Typography>
        <FormGroup sx={{ width: "100%", mt: 1 }}>
          {plans.map((plan) => {
            const isSelected = simulation.plan_id === plan.id;
            return (
              <Box
                key={plan.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                mb={0.5}
                border="1px solid #69696acd"
                borderRadius={1}
                sx={{ cursor: "pointer" }}
                onClick={() => handleSelectPlan(plan)}
              >
                <Box display="flex" alignItems="center" flexGrow={1}>
                  <Radio
                    checked={isSelected}
                    onChange={() => handleSelectPlan(plan)}
                    color="primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Typography>
                    {plan.name} - {formatBRL(plan.basePrice)}
                    {isSelected &&
                    simulation.valueSelectedProducts != null &&
                    simulation.valueSelectedProducts > 0
                      ? ` + ${formatBRL(simulation.valueSelectedProducts)}`
                      : ""}
                  </Typography>
                </Box>
                {isSelected && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDetails(plan);
                    }}
                  >
                    Detalhes
                  </Button>
                )}
              </Box>
            );
          })}
        </FormGroup>
      </Box>
    );
  }

  export default PlanSelector;
