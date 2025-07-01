import { Box, Typography, Button, Radio, FormGroup } from "@mui/material";
import SubtitlesIcon from "@mui/icons-material/Subtitles";

function PlanSelector({ plans, simulation, setSimulation, onDetails }) {
  const noTable = !simulation.price_table_id;
  const noPlans = plans.length === 0;

  if (noTable || noPlans) {
    return (
      <Box bgcolor="#1D1420" borderRadius={2} padding={2.5} mt={2}>
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

  return (
    <Box bgcolor="#1D1420" borderRadius={2} padding={2.5} mt={2}>
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
              mb={1}
              border="1px solid #4d566b"
              borderRadius={1}
              sx={{ cursor: "pointer" }}
              onClick={() =>
                setSimulation((prev) => ({
                  ...prev,
                  plan_id: plan.id,
                  monthlyFee: plan.basePrice,
                  selectedProducts: {},
                }))
              }
            >
              <Box display="flex" alignItems="center" flexGrow={1}>
                <Radio
                  checked={isSelected}
                  onChange={() =>
                    setSimulation((prev) => ({
                      ...prev,
                      plan_id: plan.id,
                    }))
                  }
                  color="primary"
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography>
                  {plan.name} - R$ {plan.basePrice.toFixed(2)}
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
