import { useState, useContext, useEffect } from "react";
import { LayoutContext } from "@/contexts/layoutContext.jsx";
import { useColumnsRanges } from "@/hooks/useColumnsRanges.js";
import { useColumnsPriceOfPlans } from "@/hooks/useColumnsPriceOfPlans.jsx";
import useHttp from "@/services/useHttp.js";
import { useNavigate, useLocation } from "react-router";
import GeneralDataPriceTable from "./GeneralDataPriceTable.jsx";
import RangeTable from "./RangeTable.jsx";
import PriceOfPlans from "./PriceOfPlans.jsx";
import RangeModal from "@/components/Modal/RangeModal.jsx";
import StepperForm from "@/components/Form/StepperForm.jsx";
import Brands from "./Brands.jsx";
import Vehicles from "./Vehicles.jsx";

function PriceTableAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVehicleType = location.state?.vehicleType || "";
  const [priceTable, setPriceTable] = useState({
    brands: [],
    ranges: [],
    vehicle_type_id: initialVehicleType,
  });
  const { drawerWidth } = useContext(LayoutContext);
  const [plansAll, setPlansAll] = useState([]);

  const steps =
    priceTable.vehicle_type_id && priceTable.vehicle_type_id !== 4
      ? ["Dados Gerais", "Marcas", "Veículos", "Tabela", "Preços dos Planos"]
      : ["Dados Gerais", "Tabela", "Preços dos Planos"];

  useEffect(() => {
    useHttp
      .get("/plans")
      .then((res) => setPlansAll(res.data.plans))
      .catch((err) => console.error("Erro ao carregar planos:", err));
  }, []);

  const { columnsRange, dataRange, handleDelete } = useColumnsRanges(
    priceTable,
    setPriceTable
  );

  const { columnsPlan, dataPlan } = useColumnsPriceOfPlans(
    priceTable,
    setPriceTable,
    plansAll
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const brandsStrings = priceTable.brands.map((b) =>
      typeof b === "number"
        ? b
        : Number(b.Value || b.value || b.Label || b.label || JSON.stringify(b))
    );

    const modelsStrings = priceTable.models
      ? priceTable.models.map((m) =>
          typeof m === "number"
            ? m
            : Number(
                m.Value || m.value || m.Label || m.label || JSON.stringify(m)
              )
        )
      : [];

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
      vehicle_type_id: priceTable.vehicle_type_id,
      name: priceTable.name,
      category_id: priceTable.category_id,
      brands: brandsStrings || [],
      models: modelsStrings || [],
      ranges: formattedRanges,
      plansSelected: priceTable.plansSelected || [],
    };

    try {
      await useHttp.post("/price-tables/create/", payload);
      navigate("/tabelas");
      console.log("Tabela criada:", payload);
    } catch (error) {
      console.error(
        "Erro ao salvar a tabela:",
        error.response?.data || error.message || error
      );
    }
  };

  const renderStepContent = (step) => {
    const isVehicleType4 = priceTable.vehicle_type_id === 4;

    if (step === 0) {
      return (
        <GeneralDataPriceTable
          priceTable={priceTable}
          setPriceTable={setPriceTable}
        />
      );
    }

    if (!isVehicleType4) {
      if (step === 1) {
        return <Brands priceTable={priceTable} setPriceTable={setPriceTable} />;
      }
      if (step === 2) {
        return (
          <Vehicles priceTable={priceTable} setPriceTable={setPriceTable} />
        );
      }
      if (step === 3) {
        return (
          <RangeTable
            priceTable={priceTable}
            setPriceTable={setPriceTable}
            columns={columnsRange}
            data={dataRange}
            handleDelete={handleDelete}
          />
        );
      }
      if (step === 4) {
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
    } else {
      if (step === 1) {
        return (
          <RangeTable
            priceTable={priceTable}
            setPriceTable={setPriceTable}
            columns={columnsRange}
            data={dataRange}
            handleDelete={handleDelete}
          />
        );
      }
      if (step === 2) {
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
    }

    return null;
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
      priceTable={priceTable}
    />
  );
}

export default PriceTableAdd;
