import * as React from "react";
import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import { useColumnsVehicleCategory } from "@/hooks/useColumnsVehicleCategory.js";
import VehicleCategoryModal from "@/components/Modal/VehicleCategoryModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PageTitle from "../../components/PageTitle/PageTitle";

function VehicleCategory() {
  const {
    columns,
    filteredCar,
    filteredMotorcycle,
    filteredTruck,
    filteredAggregate,
    vehicleCategories,
    setVehicleCategories,
    handleDelete,
  } = useColumnsVehicleCategory();
  const [openModal, setOpenModal] = useState(false);
  const [vehicleCategory, setVehicleCategory] = useState({
    name: "",
    vehicle_type_id: "",
  });
  const [value, setValue] = React.useState("1");

  const handleEdit = (id) => {
    const vehicleCategoryEdit = vehicleCategories.find((p) => p.id === id);
    if (!vehicleCategoryEdit) return;

    setVehicleCategory(vehicleCategoryEdit);
    setOpenModal(true);
  };

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
        <PageTitle title="Veículos" />
        <Button
          onClick={() => {
            setOpenModal(true);
          }}
          variant="contained"
          color="primary"
          size="small"
        >
          Nova Categoria
          <AddIcon sx={{ ml: 1 }} />
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
            handleEdit={handleEdit}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredMotorcycle}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={handleEdit}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredTruck}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={handleEdit}
          />
        </TabPanel>
        <TabPanel value="4" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredAggregate}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={handleEdit}
          />
        </TabPanel>
      </TabContext>
      <VehicleCategoryModal
        open={openModal}
        vehicleCategory={vehicleCategory}
        setVehicleCategory={setVehicleCategory}
        setVehicleCategories={setVehicleCategories}
        onClose={() => {
          setOpenModal(false);
          setVehicleCategory({});
        }}
      />
    </Box>
  );
}

export default VehicleCategory;
