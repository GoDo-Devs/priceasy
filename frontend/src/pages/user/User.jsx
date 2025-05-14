import { useContext, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { Box, IconButton, Tooltip, Fab } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LayoutContext } from "@/contexts/layoutContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useColumnsUser } from "@/hooks/useColumnsUser.js";
import { useNavigate } from "react-router";

function Product() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, users, handleDelete } = useColumnsUser();

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: drawerWidth === 0 ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
        transition: "width 0.1s ease",
      }}
    >
      <MaterialReactTable
        localization={MRT_Localization_PT_BR}
        columns={columns}
        data={users}
        enableFullScreenToggle={false}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <>
            <Tooltip title="Editar">
              <IconButton
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton
                color="primary"
                onClick={() => handleDelete(row.original)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
        muiTableContainerProps={{
          sx: { height: "100%" },
        }}
        muiTableBodyProps={{
          sx: { height: "100%" },
        }}
      />
      <Fab
        color="primary"
        aria-label="Criar Produto"
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

export default Product;
