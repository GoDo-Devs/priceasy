import { Box, Checkbox, FormControlLabel } from "@mui/material";
import DataTable from "@/components/Table/DataTable.jsx";

function PriceOfPlans({ priceTable, setPriceTable, columns, data, plansAll }) {
  const handlePlanChange = (planId, checked) => {
    const updated = checked
      ? [...(priceTable.plansSelected || []), planId]
      : (priceTable.plansSelected || []).filter((id) => id !== planId);

    setPriceTable((prev) => ({
      ...prev,
      plansSelected: updated,
      ranges: prev.ranges.map((range) => ({
        ...range,
        pricePlanId: (range.pricePlanId || []).filter((p) =>
          updated.includes(p.plan_id)
        ),
      })),
    }));
  };

  return (
    <Box>
      <DataTable
        columns={columns}
        data={data}
        enableDelete={false}
        paddingTop="16px"
        paddingBottom="16px"
        topToolbar={() => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              padding: "10px 20px",
              backgroundColor: "background.paper",
              marginBottom: 2,
            }}
          >
            {plansAll.map((plan) => (
              <FormControlLabel
              
                key={plan.id}
                control={
                  <Checkbox
                  sx={{ paddingBottom: 0.5, paddingTop: 0.5}}
                    checked={
                      priceTable.plansSelected?.includes(plan.id) || false
                    }
                    onChange={(e) =>
                      handlePlanChange(plan.id, e.target.checked)
                    }
                  />
                }
                label={plan.name}
              />
            ))}
          </Box>
        )}
      />
    </Box>
  );
}

export default PriceOfPlans;
