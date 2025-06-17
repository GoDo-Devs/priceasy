import { useNavigate } from "react-router";
import { Box, Button, Stack } from "@mui/material";
import { useColumnsPlan } from "@/hooks/useColumnsPlan.js";
import DataTable from "@/components/Table/DataTable.jsx";
import PageTitle from "../../components/PageTitle/PageTitle";

function Plan() {
  const { columns, plans, handleDelete } = useColumnsPlan();
  const navigate = useNavigate();

  return (
    <Box padding={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageTitle title="Planos" />
        <Button onClick={()=> navigate("/plano")} size="small" variant="contained" color="primary">
          Adicionar Plano
        </Button>
      </Stack>
      <DataTable
        columns={columns}
        data={plans}
        handleDelete={handleDelete}
        enableEdit={true}
        handleEdit={(id) => navigate(`/plano?id=${id}`)}
      />
    </Box>
  );
}

export default Plan;
