import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useColumnsPriceTable } from "@/hooks/useColumnsPriceTable.js";
import DataTable from "@/components/Table/DataTable.jsx";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";
import PageTitle from "../../components/PageTitle/PageTitle";

function PriceTable() {
  const [openModal, setOpenModal] = useState(false);
  const [priceTable, setPriceTable] = useState({});
  const { columns, priceTables, handleDelete } = useColumnsPriceTable();

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Tabelas de Preços" />
        <Button
          onClick={() => {
            setOpenModal(true);
            setPriceTable({});
          }}
          size="small"
          variant="contained"
          color="primary"
        >
          Adicionar Tabela
        </Button>
      </Stack>
      <DataTable
        columns={columns}
        data={priceTables}
        handleDelete={handleDelete}
        enableEdit={true}
      />
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
