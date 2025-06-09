import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { useState } from "react";

function SelectDataTable({ data, columns, title, rowSelection, onRowSelectionChange}) {
  return (
    <div>
      {title && <h3 style={{ marginBottom: "10px"}}>{title}</h3>}
      <MaterialReactTable
        localization={MRT_Localization_PT_BR}
        columns={columns}
        data={data}
        getRowId={(row) => row.id.toString()} 
        enableFullScreenToggle={false}
        disableRowActions
        enableRowSelection
        onRowSelectionChange={onRowSelectionChange}
        state={{ rowSelection }}
        enablePagination={false} 
        muiTablePaperProps={{
          sx: { borderRadius: "15px", overflow: "hidden", marginBottom: "20px" },
        }}
        muiTableContainerProps={{
          sx: { maxHeight: `100%`, padding: "30px"},
        }}
        muiTableBodyProps={{
          sx: { height: "100%"},
        }}
      />
    </div>
  );
}

export default SelectDataTable;
