import { useContext } from "react";
import { useNavigate } from "react-router";
import { Box, Button } from "@mui/material";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsPlan } from "@/hooks/useColumnsPlan.js";
import DataTable from "@/components/Table/DataTable.jsx";

function Plan() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, plans, handleDelete } = useColumnsPlan();
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
        data={plans}
        handleDelete={handleDelete}
        enableEdit={true}
        handleEdit={(id) => navigate(`/plano?id=${id}`)}
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button onClick={()=> navigate("/plano")} variant="contained" color="primary">
          Adicionar Plano
        </Button>
      </Box>
    </Box>
  );
}

export default Plan;
