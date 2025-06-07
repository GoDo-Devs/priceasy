import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AlertModal from "@/components/Modal/AlertModal.jsx";
import { useState } from "react";

function DataTable({
  data,
  columns,
  handleDelete,
  enableEdit = false,
  enableDelete = true,
  enableRowActions = true
}) {
  const [alertModal, setAlertModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectRow, setSelectRow] = useState("");

  return (
    <div>
      <MaterialReactTable
        localization={MRT_Localization_PT_BR}
        columns={columns}
        data={data}
        enableFullScreenToggle={false}
        enableRowActions={enableRowActions}
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <>
            {enableEdit && (
              <Tooltip title="Editar">
                <IconButton color="primary" onClick={() => {}}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {enableDelete && (
              <Tooltip title="Excluir">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setSelectedName(row.original.name);
                    setSelectRow(row.original);
                    setAlertModal(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
        muiTablePaperProps={{
          sx: { borderRadius: "15px", overflow: "hidden" },
        }}
        muiTableContainerProps={{
          sx: { height: `100vh`, padding: "30px" },
        }}
        muiTableBodyProps={{
          sx: { height: "100%" },
        }}
      />
      <AlertModal
        open={alertModal}
        selectedName={selectedName}
        handleDelete={() => {
          handleDelete(selectRow);
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
