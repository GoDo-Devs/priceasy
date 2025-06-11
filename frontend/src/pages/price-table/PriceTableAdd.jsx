import { useState, useContext, useEffect } from "react";
import { LayoutContext } from "@/contexts/layoutContext.jsx";
import { useColumnsRanges } from "@/hooks/useColumnsRanges.js";
import { useColumnsPriceOfPlans } from "@/hooks/useColumnsPriceOfPlans.jsx";
import useHttp from "@/services/useHttp.js";
import { useNavigate } from "react-router";
import GeneralDataPriceTable from "./GeneralDataPriceTable.jsx";
import RangeTable from "./RangeTable.jsx";
import PriceOfPlans from "./PriceOfPlans.jsx";
import RangeModal from "@/components/Modal/RangeModal.jsx";
import StepperForm from "@/components/Form/StepperForm.jsx";
const steps = ["Dados Gerais", "Tabela", "Preços dos Planos"];

function PriceTableAdd() {
  const navigate = useNavigate();
  const [priceTable, setPriceTable] = useState({ ranges: [] });
  const { drawerWidth } = useContext(LayoutContext);
  const [plansAll, setPlansAll] = useState([]);

  useEffect(() => {
    useHttp
      .get("/plans")
      .then((res) => setPlansAll(res.data.plans))
      .catch((err) => console.error("Erro ao carregar planos:", err));
  }, []);

  const { columnsRange, dataRange, handleDelete } =
    useColumnsRanges(priceTable, setPriceTable);

  const { columnsPlan, dataPlan } = useColumnsPriceOfPlans(
    priceTable,
    setPriceTable,
    plansAll
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedRanges = priceTable.ranges.map((range) => {
      return {
        ...range,
        pricePlanId: Object.entries(range.planPrices || {}).map(
          ([planId, basePrice]) => ({
            plan_id: parseInt(planId),
            basePrice: parseFloat(basePrice),
          })
        ),
        planPrices: undefined,
      };
    });

    const payload = {
      ...priceTable,
      ranges: formattedRanges,
    };

    try {
      await useHttp.post("/price-tables/create/", payload);
      navigate("/tabelas");
      console.log("Tabela criada:", payload);
    } catch (error) {
      console.error("Erro ao salvar a tabela:", payload);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <GeneralDataPriceTable
            priceTable={priceTable}
            setPriceTable={setPriceTable}
          />
        );
      case 1:
        return (
          <RangeTable
            priceTable={priceTable}
            setPriceTable={setPriceTable}
            columns={columnsRange}
            data={dataRange}
            handleDelete={handleDelete}
          />
        );
      case 2:
        return (
          <PriceOfPlans
            priceTable={priceTable}
            setPriceTable={setPriceTable}
            columns={columnsPlan}
            data={dataPlan}
            plansAll={plansAll}
          />
        );
      case 3:
        return (
          <PriceOfPlans
            priceTable={priceTable}
            setPriceTable={setPriceTable}
            columns={columnsPlan}
            data={dataPlan}
            plansAll={plansAll}
          />
        );
    }
  };

  const renderModal = (open, onClose) => (
    <RangeModal
      open={open}
      onClose={onClose}
      priceTable={priceTable}
      setPriceTable={setPriceTable}
    />
  );

  return (
    <StepperForm
      steps={steps}
      renderStepContent={renderStepContent}
      onSubmit={handleSubmit}
      drawerWidth={drawerWidth}
      onAddItem={renderModal}
      showAddButton={true}
    />
  );
}

export default PriceTableAdd;
