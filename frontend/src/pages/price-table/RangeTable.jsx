import { Box } from "@mui/material";
import DataTable from "@/components/Table/DataTable";

function RangeTable({ columns, data, handleDelete }){
  return (
    <Box>
      <DataTable
        columns={columns}
        data={data}
        handleDelete={handleDelete}
      />
    </Box>
  )
}

export default RangeTable
