import { useContext } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsUser } from "@/hooks/useColumnsUser.js";
import { useNavigate } from "react-router";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function User() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, users, handleDelete } = useColumnsUser();
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
        data={users}
        handleDelete={handleDelete}
      />
      <ButtonFab
        title={"Criar Usuário"}
        onClick={() => navigate("/auth/register")}
        Icon={PersonAddIcon}
      />
    </Box>
  );
}

export default User;
