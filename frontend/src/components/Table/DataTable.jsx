import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function DataTable({ data, columns, handleDelete }) {
  return (
    <MaterialReactTable
      localization={MRT_Localization_PT_BR}
      columns={columns}
      data={data}
      enableFullScreenToggle={false}
      enableRowActions
      positionActionsColumn="last"
      renderRowActions={({ row }) => (
        <Tooltip title="Excluir">
          <IconButton
            color="primary"
            onClick={() => handleDelete(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      muiTableContainerProps={{
        sx: { height: "100%" },
      }}
      muiTableBodyProps={{
        sx: { height: "100%" },
      }}
    />
  );
}

export default DataTable;
