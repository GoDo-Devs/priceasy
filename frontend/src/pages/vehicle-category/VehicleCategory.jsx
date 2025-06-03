import * as React from "react";
import { useContext, useState } from "react";
import { Box} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsVehicleCategory } from "@/hooks/useColumnsVehicleCategory.js";
import VehicleCategoryModal from "@/components/Modal/VehicleCategoryModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from '@mui/icons-material/Agriculture';

function VehicleCategory() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, vehicleCategories, handleDelete } = useColumnsVehicleCategory();
  const [openModal, setOpenModal] = useState(false);
  const [vehicleCategory, setVehicleCategory] = useState({name: "", vehicle_type_id:""});
  const filteredCar = vehicleCategories.filter((item) => item.vehicle_type_id === 1);
  const filteredMotorcycle = vehicleCategories.filter((item) => item.vehicle_type_id === 2);
  const filteredTruck = vehicleCategories.filter((item) => item.vehicle_type_id === 3);
  const filteredAggregate = vehicleCategories.filter((item) => item.vehicle_type_id === 4);
  const [value, setValue] = React.useState("1");
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px"
      }}
    >
      <ButtonFab
        title={"Criar Tipo de Veículo"}
        onClick={() => setOpenModal(true)}
        Icon={AddIcon}
      />
      <VehicleCategoryModal
        open={openModal}
        vehicleCategory={vehicleCategory}
        setVehicleCategory={setVehicleCategory}
        onClose={() => {
          setOpenModal(false);
          setVehicleCategory({});
        }}
      />
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
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredMotorcycle}
            handleDelete={handleDelete}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredTruck}
            handleDelete={handleDelete}
          />
        </TabPanel>
        <TabPanel value="4" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredAggregate}
            handleDelete={handleDelete}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default VehicleCategory;
