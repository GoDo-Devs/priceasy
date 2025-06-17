import { Box } from "@mui/material";
import DataTable from "@/components/Table/DataTable";
import RangeModal from "../../components/Modal/RangeModal";
import { useState } from "react";

function RangeTable({
  columns,
  data,
  handleDelete,
  priceTable,
  setPriceTable,
}) {
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [editingRange, setEditingRange] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditRange = (index) => {
    setEditingRange(priceTable.ranges[index]);
    setEditingIndex(index);
    setIsRangeModalOpen(true);
  };

  return (
    <>
      <Box>
        <DataTable
          columns={columns}
          data={data}
          handleDelete={handleDelete}
          enableEdit={true}
          handleEdit={(index) => handleEditRange(index)}
        />
      </Box>
      <RangeModal
        open={isRangeModalOpen}
        onClose={() => {
          setIsRangeModalOpen(false);
          setEditingRange(null);
          setEditingIndex(null);
        }}
        priceTable={priceTable}
        setPriceTable={setPriceTable}
        editingRange={editingRange}
        editingIndex={editingIndex}
      />
    </>
  );
}

export default RangeTable;
