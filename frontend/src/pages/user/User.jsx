import { useContext } from "react";
import { Box, Fab } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsUser } from "@/hooks/useColumnsUser.js";
import { useNavigate } from "react-router";
import DataTable from "@/components/Table/DataTable.jsx";

function User() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, users, handleDelete } = useColumnsUser();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <DataTable columns={columns} data={users} handleDelete={handleDelete} />
      <Fab
        color="primary"
        aria-label="Criar Usuário"
        onClick={() => navigate("/auth/register")}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <PersonAddIcon />
      </Fab>
    </Box>
  );
}

export default User;
