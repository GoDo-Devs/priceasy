import { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsPriceTable } from "@/hooks/useColumnsPriceTable.js";
import DataTable from "@/components/Table/DataTable.jsx";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";

function PriceTable() {
  const [openModal, setOpenModal] = useState(false);
  const [priceTable, setPriceTable] = useState({});
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, priceTables, handleDelete } = useColumnsPriceTable();

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px",
      }}
    >
      <DataTable
        columns={columns}
        data={priceTables}
        handleDelete={handleDelete}
        enableEdit={true}
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          onClick={() => {
            setOpenModal(true);
            setPriceTable({});
          }}
          variant="contained"
          color="primary"
        >
          Adicionar Tabela
        </Button>
      </Box>
      <VehicleTypeModal
        open={openModal}
        priceTable={priceTable}
        setPriceTable={setPriceTable}
        onClose={() => {
          setOpenModal(false);
          setPriceTable({});
        }}
      />
    </Box>
  );
}

export default PriceTable;
