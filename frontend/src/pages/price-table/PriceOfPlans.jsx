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
          onChange={(e) =>
            setPriceTable((priceTable) => ({
              ...priceTable,
              plansSelected: e.target.value,
            }))
          }
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
          enableRowActions={false}
        />
      </Box>
    </>
  );
}

export default PriceOfPlans;
