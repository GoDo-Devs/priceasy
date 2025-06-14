import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DataTable from "@/components/Table/DataTable";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";
import useHttp from "@/services/useHttp.js";

function PriceOfPlans({ priceTable, setPriceTable, columns, data, plansAll }) {
  const [plans, setPlans] = useState({
    all: [],
    selected: [],
  });

  useEffect(() => {
    useHttp
      .get("/plans")
      .then((res) =>
        setPlans({
          all: res.data.plans,
          selected: [],
        })
      )
      .catch((err) => console.error("Erro ao carregar planos:", err));
  }, []);

  console.log(priceTable)
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CheckBoxInput
          className="mb-1"
          value={priceTable.plansSelected}
          onChange={(e) => {
            const selectedPlans = e.target.value;
            setPriceTable((prev) => {
              const updatedRanges = prev.ranges.map((range) => {
                const currentPlanPrices = { ...(range.planPrices || {}) };
                selectedPlans.forEach((planId) => {
                  if (!(planId in currentPlanPrices)) {
                    currentPlanPrices[planId] = "";
                  }
                });
                Object.keys(currentPlanPrices).forEach((planId) => {
                  if (!selectedPlans.includes(parseInt(planId))) {
                    delete currentPlanPrices[planId];
                  }
                });
                return {
                  ...range,
                  planPrices: currentPlanPrices,
                };
              });
              return {
                ...prev,
                plansSelected: selectedPlans,
                ranges: updatedRanges,
              };
            });
          }}
          options={plansAll.map((g) => ({
            value: g.id,
            label: g.name,
          }))}
        />
      </Box>
      <Box>
        <DataTable
          columns={columns}
          data={data}
          enableDelete={false}
          paddingTop="16px"
          paddingBottom="16px"
        />
      </Box>
    </>
  );
}

export default PriceOfPlans;
