import { useContext, useState } from "react";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsService } from "@/hooks/useColumnsService.js";
import ServiceModal from "@/components/Modal/ServiceModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";

function Service() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, services, handleDelete } = useColumnsService();
  const [openModal, setOpenModal] = useState(false);
  const [service, setService] = useState({});

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
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <DataTable
        columns={columns}
        data={services}
        handleDelete={handleDelete}
      />
      <Fab
        color="primary"
        aria-label="Criar Serviço"
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 24,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>
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
    </Box>
  );
}

export default Service;
