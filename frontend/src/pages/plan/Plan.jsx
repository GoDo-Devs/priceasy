import { useContext, useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LayoutContext } from "@/contexts/layoutContext";
import { useColumnsPlan } from "@/hooks/useColumnsPlan.js";
import PlanModal from "@/components/Modal/PlanModal.jsx";
import DataTable from "@/components/Table/DataTable.jsx";
import ButtonFab from "../../components/Fab/ButtonFab";

function Plan() {
  const { drawerWidth } = useContext(LayoutContext);
  const { columns, plans, handleDelete } = useColumnsPlan();
  const [openModal, setOpenModal] = useState(false);
  const [plan, setPlan] = useState();

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
        data={plans}
        handleDelete={handleDelete}
      />
      <ButtonFab
        title={"Criar Plano"}
        onClick={() => setOpenModal(true)}
        Icon={AddIcon}
      />
      <PlanModal
        open={openModal}
        plan={plan}
        setPlan={setPlan}
        onClose={() => {
          setOpenModal(false);
          setPlan({});
        }}
      />
    </Box>
  );
}

export default Plan;
