import * as React from "react";
import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import ServiceModal from "@/components/Modal/ServiceModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function Service() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, services, handleDelete } = useColumnsService();
  const [openModal, setOpenModal] = useState(false);
  const [service, setService] = useState({ name: "", category_id: "" });
  const filteredCoverage = services.filter((item) => item.category_id === 1);
  const filteredAssistance = services.filter((item) => item.category_id === 2);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleGroupChange = (e) => {
    const selected = e.target.value;
    setProduct({
      ...service,
      category_id: selected,
    });
  };

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "99vw" : `calc(99vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
        padding: "30px",
      }}
    >
      <ButtonFab
        title={"Criar Serviço"}
        onClick={() => setOpenModal(true)}
        Icon={AddIcon}
      />
      <ServiceModal
        open={openModal}
        service={service}
        setService={setService}
        onChange={handleGroupChange}
        onClose={() => {
          setOpenModal(false);
          setService({});
        }}
      />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="mb-3">
          <TabList onChange={handleChange}>
            <Tab label="Cobertura" value="1" />
            <Tab label="Assistência 24h" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredCoverage}
            handleDelete={handleDelete}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredAssistance}
            handleDelete={handleDelete}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Service;
