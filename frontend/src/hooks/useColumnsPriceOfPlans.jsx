import React from "react";
import { useMemo } from "react";
import TextField from "@mui/material/TextField";

export function useColumnsPriceOfPlans(priceTable, setPriceTable, plansAll) {
  const columnsPlan = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "intervalo",
        header: "Intervalo",
        Cell: ({ row }) => {
          const min = row.original.min;
          const max = row.original.max;

          return `R$ ${Number(min).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })} a R$ ${Number(max).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "basePrice",
        header: "Preço Base",
        Cell: ({ cell }) =>
          `R$ ${Number(cell.getValue()).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`,
      },
    ];

    const dynamicPlanColumns = (priceTable.plansSelected || []).map(
      (planId) => {
        const plan = plansAll.find((p) => p.id === planId);
        return {
          accessorKey: `plan_${planId}`,
          header: plan ? plan.name : `Plano ${planId}`,
          Cell: ({ row }) => {
            const value = row.original.planPrices
              ? row.original.planPrices[planId] || ""
              : "";
            const handleChange = (e) => {
              const newValue = e.target.value;
              setPriceTable((prev) => {
                const newRanges = prev.ranges.map((range, idx) => {
                  if (idx === row.index) {
                    const updatedPlanPrices = {
                      ...(range.planPrices || {}),
                      [planId]: newValue,
                    };

                    return {
                      ...range,
                      planPrices: updatedPlanPrices,
                    };
                  }

                  return range;
                });

                return {
                  ...prev,
                  ranges: newRanges,
                };
              });
            };
            return (
              <TextField
                sx={{ width: "100px" }}
                variant="outlined"
                size="small"
                value={value}
                onChange={handleChange}
                slotProps={{
                  input: {
                    style: {
                      height: "32px",
                      fontSize: "0.875rem",
                      boxSizing: "border-box",
                    },
                  },
                }}
              />
            );
          },
        };
      }
    );

    return [...baseColumns, ...dynamicPlanColumns];
  }, [priceTable, setPriceTable, plansAll]);

  return { columnsPlan, dataPlan: priceTable.ranges || [] };
}
