import * as React from "react";
import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { useColumnsPriceTable } from "@/hooks/useColumnsPriceTable.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import VehicleTypeModal from "@/components/Modal/VehicleTypeModal.jsx";
import PageTitle from "../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";

function PriceTable() {
  const [openModal, setOpenModal] = useState(false);
  const [priceTable, setPriceTable] = useState({});
  const {
    columns,
    filteredCar,
    filteredMotorcycle,
    filteredTruck,
    filteredAggregate,
    handleDelete,
  } = useColumnsPriceTable();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="mb-3">
          <TabList onChange={handleChange}>
            <Tab icon={<DirectionsCarIcon />} value="1" aria-label="Carro" />
            <Tab icon={<TwoWheelerIcon />} value="2" aria-label="Moto" />
            <Tab icon={<LocalShippingIcon />} value="3" aria-label="Caminhão" />
            <Tab icon={<AgricultureIcon />} value="4" aria-label="Agregado" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredCar}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={(id) => navigate(`/adicionar-tabela/?id=${id}`)}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredMotorcycle}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={(id) => navigate(`/adicionar-tabela/?id=${id}`)}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredTruck}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={(id) => navigate(`/adicionar-tabela/?id=${id}`)}
          />
        </TabPanel>
        <TabPanel value="4" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredAggregate}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={(id) => navigate(`/adicionar-tabela/?id=${id}`)}
          />
        </TabPanel>
      </TabContext>
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
