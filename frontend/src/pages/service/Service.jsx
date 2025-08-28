import * as React from "react";
import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddIcon from "@mui/icons-material/Add";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import ServiceModal from "@/components/Modal/ServiceModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import PageTitle from "../../components/PageTitle/PageTitle";

function Service() {
  const {
    columns,
    filteredCoverage,
    filteredAssistance,
    handleDelete,
    services,
    setServices,
  } = useColumnsService();
  const [openModal, setOpenModal] = useState(false);
  const [service, setService] = useState({ name: "", category_id: "" });
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = (id) => {
    const serviceEdit = services.find((p) => p.id === id);
    if (!serviceEdit) return;

    setService(serviceEdit);
    setOpenModal(true);
  };

  const handleGroupChange = (e) => {
    const selected = e.target.value;
    setProduct({
      ...service,
      category_id: selected,
    });
  };

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Serviços" />
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Criar Serviço
          <AddIcon sx={{ ml: 1 }} />
        </Button>
      </Stack>
      <ServiceModal
        open={openModal}
        service={service}
        setService={setService}
        setServices={setServices}
        onChange={handleGroupChange}
        onClose={() => {
          setOpenModal(false);
          setService({ name: "", category_id: "" });
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
            enableEdit={true}
            handleEdit={handleEdit}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          <DataTable
            columns={columns}
            data={filteredAssistance}
            handleDelete={handleDelete}
            enableEdit={true}
            handleEdit={handleEdit}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Service;
