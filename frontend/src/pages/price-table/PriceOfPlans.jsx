import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DataTable from "@/components/Table/DataTable";
import CheckBoxInput from "@/components/Form/CheckBoxInput.jsx";

function PriceOfPlans({ priceTable, setPriceTable, columns, data, plansAll }) {
  const [plans, setPlans] = useState({
    all: [],
    selected: [],
  });

  useEffect(() => {
    if (!priceTable.plansSelected || priceTable.plansSelected.length === 0) {
      const planosSelecionados = (priceTable.ranges || [])
        .flatMap((range) => (range.pricePlanId || []).map((p) => p.plan_id))
        .filter((v, i, a) => a.indexOf(v) === i);

      if (planosSelecionados.length > 0) {
        setPriceTable((prev) => ({
          ...prev,
          plansSelected: planosSelecionados,
        }));
      }
    }
  }, [priceTable.ranges, priceTable.plansSelected, setPriceTable]);

  return (
    <>
      <Box
        sx={{
          borderRadius: "15px",
          backgroundColor: "background.paper",
          padding: "5px 20px",
          mt: 3,
        }}
        display="flex"
        flexDirection="column"
        gap={2}
        mb={2}
      >
        <CheckBoxInput
          className="mb-1"
          value={priceTable.plansSelected}
          onChange={(e) => {
            const selectedPlans = e.target.value;

            setPriceTable((prev) => {
              const updatedRanges = prev.ranges.map((range) => ({
                ...range,
                pricePlanId: (range.pricePlanId || []).filter((p) =>
                  selectedPlans.includes(p.plan_id)
                ),
              }));

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
