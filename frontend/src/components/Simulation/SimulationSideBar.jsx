import { useState, useEffect } from "react";
import { Card, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import useHttp from "@/services/useHttp";
import useSimulationEffects from "@/hooks/useSimulationEffects.js";
import { useSimulation } from "@/contexts/SimulationContext.jsx";
import { useCompleteSimulation } from "@/hooks/useCompleteSimulation";
import DiscountModal from "@/components/Modal/DiscountModal.jsx";
import SuccessModal from "@/components/Modal/SucessModal";
import ErrorModal from "@/components/Modal/ErrorModal";
import { generatePdf } from "@/utils/generatePdf";

import PriceCardsList from "./PriceCardsList.jsx";

function SimulationSideBar() {
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [consultant, setConsultant] = useState(null);

  const navigate = useNavigate();
  const { simulation: baseSimulation, setSimulation, client } = useSimulation();
  const { simulation } = useCompleteSimulation(baseSimulation);
  const { rangeDetails, saveSimulation } = useSimulationEffects();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const toNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const handleEditClick = (type) => {
    setEditType(type);
    setOpenDiscountModal(true);
  };

  const handleSave = async () => {
    const result = await saveSimulation(simulation, rangeDetails);

    if (result && result.id) {
      setSimulation((prev) => ({
        ...prev,
        id: result.id,
        user_id: result.user_id ?? prev.user_id,
      }));
      setOpenSuccessModal(true);
    } else {
      setErrorMessage(
        typeof result === "string"
          ? result
          : "Ocorreu um erro ao salvar a cotação. Verifique os dados e tente novamente."
      );
      setShowError(true);
    }
  };

  useEffect(() => {
    if (!simulation?.user_id) return;

    useHttp
      .post("/users/by-id", { id: simulation.user_id })
      .then((res) => setConsultant(res.data))
      .catch((err) => {
        console.error("Erro ao buscar consultor:", err);
        setConsultant(null);
      });
  }, [simulation?.user_id]);

  return (
    <Card
      elevation={0}
      className="p-4"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" mb={2} fontWeight="bold">
          Resumo da Cotação
        </Typography>
        <PriceCardsList
          simulation={simulation}
          rangeDetails={rangeDetails}
          onEdit={handleEditClick}
          toNumber={toNumber}
        />
      </Box>
      <Box>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Box>
      <DiscountModal
        open={openDiscountModal}
        onClose={() => {
          setOpenDiscountModal(false);
          setEditType(null);
        }}
        type={editType}
        simulation={simulation}
        setSimulation={setSimulation}
        rangeDetails={rangeDetails}
      />
      <SuccessModal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        onConfirm={() => {
          setOpenSuccessModal(false);
          navigate("/");
        }}
        onDownload={() => {
          if (!client || !simulation?.id) {
            alert("Dados da simulação ou cliente ausentes!");
            return;
          }
          generatePdf(client, simulation, rangeDetails, consultant);
        }}
        onSendEmail={() => alert("Implementar função enviar e-mail")}
        title="Cotação salva com sucesso!"
        message="Você pode baixar o arquivo ou enviar para o e-mail. Ou ir para a tela inicial."
      />
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        title="Erro ao salvar a cotação"
        message={errorMessage}
      />
    </Card>
  );
}

export default SimulationSideBar;
