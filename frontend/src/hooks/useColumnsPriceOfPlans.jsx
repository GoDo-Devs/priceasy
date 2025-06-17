import { useMemo } from "react";
import TextField from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";

export function useColumnsPriceOfPlans(priceTable, setPriceTable, plansAll) {
  const parseNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
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
        Cell: ({ cell }) => {
          const value = parseNumber(cell.getValue());
          return `R$ ${value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`;
        },
      },
    ];

    const dynamicPlanColumns = (priceTable.plansSelected || []).map(
      (planId) => {
        const plan = plansAll.find((p) => p.id === planId);

        return {
          accessorKey: `plan_${planId}`,
          header: plan ? plan.name : `Plano ${planId}`,
          Cell: ({ row }) => {
            const planPriceObj = row.original.pricePlanId?.find(
              (p) => p.plan_id === planId
            );
            const value = planPriceObj ? planPriceObj.basePrice ?? 0 : 0;

            const handleChange = (values) => {
              const newValue = values.floatValue ?? 0;

              setPriceTable((prev) => {
                const newRanges = prev.ranges.map((range, idx) => {
                  if (idx === row.index) {
                    let pricePlanIdArray = range.pricePlanId || [];
                    const hasPlan = pricePlanIdArray.some(
                      (p) => p.plan_id === planId
                    );

                    if (!hasPlan) {
                      pricePlanIdArray = [
                        ...pricePlanIdArray,
                        { plan_id: planId, basePrice: newValue },
                      ];
                    } else {
                      pricePlanIdArray = pricePlanIdArray.map((p) =>
                        p.plan_id === planId ? { ...p, basePrice: newValue } : p
                      );
                    }

                    return {
                      ...range,
                      pricePlanId: pricePlanIdArray,
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
              <NumericFormat
                value={value}
                onValueChange={handleChange}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                customInput={TextField}
                variant="outlined"
                size="small"
                sx={{ width: "130px" }}
                inputProps={{
                  style: {
                    height: "32px",
                    fontSize: "0.875rem",
                    boxSizing: "border-box",
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
