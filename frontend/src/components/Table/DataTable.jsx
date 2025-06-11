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
  handleEdit,
  paddingTop = "10px",
  paddingBottom = "8px",
}) {
  const [alertModal, setAlertModal] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectRow, setSelectRow] = useState("");

  const columnsWithActions = [
    ...columns,
    {
      id: "actions",
      header: null,
      enableSorting: false,
      enableHiding: false,
      size: 10,
      muiTableHeadCellProps: {
        sx: {
          textAlign: "right",
          "& .MuiTableHeadCell-content": {
            justifyContent: "flex-end",
          },
        },
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "right",
          position: "sticky",
          right: 0,
          zIndex: 10,
          minWidth: "0px",
        },
      },
      Cell: ({ row }) => (
        <>
          {enableEdit && (
            <Tooltip title="Editar">
              <IconButton
                color="primary"
                onClick={() => {
                  if (typeof handleEdit === "function") {
                    handleEdit(row.original.id ?? row.index);
                  } else {
                    console.error("handleEdit não é função:", handleEdit);
                  }
                }}
              >
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
      ),
    },
  ];

  return (
    <div>
      <MaterialReactTable
        localization={MRT_Localization_PT_BR}
        columns={columnsWithActions}
        data={data}
        enableFullScreenToggle={false}
        enableRowActions={false}
        enableColumnActions={false}
        muiTablePaperProps={{
          sx: { borderRadius: "15px", overflow: "hidden" },
        }}
        muiTableContainerProps={{
          sx: { minHeight: `100vh`, padding: "30px" },
        }}
        muiTableBodyProps={{
          sx: { height: "100%" },
        }}
        muiTableBodyRowProps={{
          sx: {
            "& > td": {
              paddingTop: paddingTop,
              paddingBottom: paddingBottom,
            },
          },
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
