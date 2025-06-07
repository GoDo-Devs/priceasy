import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsPriceTable } from "@/hooks/useColumnsPriceTable.js";
import DataTable from "@/components/Table/DataTable.jsx";

function PriceTable() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, priceTables, handleDelete } = useColumnsPriceTable();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px"
      }}
    >
      <DataTable
        columns={columns}
        data={priceTables}
        handleDelete={handleDelete}
        enableEdit={true}
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={()=> navigate("/adicionar-tabela")} variant="contained" color="primary">
          Adicionar Tabela
        </Button>
      </Box>
    </Box>
  );
}

export default PriceTable;

