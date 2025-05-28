import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertModal from "@/components/Modal/AlertModal.jsx";
import { useState } from "react";

function DataTable({ data, columns, handleDelete, width }) {
  const [alertModal, setAlertModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [deletedId, setDeleteId] = useState("");

  return (
    <div style={{ height: `calc(100vh - ${width}px)`, overflowY: "auto" }}>
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
              onClick={() => {
                setSelectedName(row.original.name);
                setDeleteId(row.original);
                setAlertModal(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        muiTableContainerProps={{
          sx: { height: "100vh" },
        }}
        muiTableBodyProps={{
          sx: { height: "100%" },
        }}
      />
      <AlertModal
        open={alertModal}
        selectedName={selectedName}
        handleDelete={() => {
          handleDelete(deletedId);
          setAlertModal(false);
        }}
        onClose={() => {
          setAlertModal(false);
          setSelectedName("");
        }}
      />
    </div>
  );
}

export default DataTable;
