import { Box, Typography, Button, Radio, FormGroup } from "@mui/material";

function PlanSelectorAggregates({
  aggregate,
  plans,
  setSimulation,
  onDetails,
}) {
  if (!aggregate) return null;

  const aggregatePlans = plans[aggregate.id] || [];
  if (aggregatePlans.length === 0) return null;

  const formatBRL = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "-";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleSelectPlan = (aggregateKey, plan) => {
    setSimulation((prev) => ({
      ...prev,
      aggregates: prev.aggregates.map((agg) =>
        agg.key === aggregateKey ? { ...agg, planId: plan.id } : agg
      ),
    }));
  };

  return (
    <Box bgcolor="#1D1420" borderRadius={2}>
      <FormGroup
        key={`${aggregate.id}-${aggregate.key}`}
        sx={{ width: "100%" }}
      >
        {aggregatePlans.map((plan) => {
          const isSelected = aggregate.planId === plan.id;

          return (
            <Box
              key={`${aggregate.key}-${plan.id}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              mb={1}
              border="1px solid #69696acd"
              borderRadius={1}
              sx={{ cursor: "pointer" }}
              onClick={() => handleSelectPlan(aggregate.key, plan)}
            >
              <Box display="flex" alignItems="center" flexGrow={1}>
                <Radio
                  checked={isSelected}
                  onChange={() => handleSelectPlan(aggregate.key, plan)}
                  color="primary"
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography>
                  {plan.name} - {formatBRL(aggregate.basePrice)}
                  {aggregate.valueSelectedProducts > 0
                    ? ` + ${formatBRL(aggregate.valueSelectedProducts)}`
                    : ""}
                </Typography>
              </Box>
              {isSelected && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetails({
                      ...plan,
                      key: aggregate.key,
                      basePrice: aggregate.basePrice,
                    });
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

export default PlanSelectorAggregates;
