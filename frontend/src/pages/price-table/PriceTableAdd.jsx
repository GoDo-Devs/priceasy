import { useState, useContext, useEffect } from "react";
import { LayoutContext } from "@/contexts/layoutContext.jsx";
import { useColumnsRanges } from "@/hooks/useColumnsRanges.js";
import { useColumnsPriceOfPlans } from "@/hooks/useColumnsPriceOfPlans.jsx";
import useHttp from "@/services/useHttp.js";
import { useSearchParams, useNavigate, useLocation } from "react-router";
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
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    const fetchPriceTable = async () => {
      try {
        const res = await useHttp.get(`/price-tables/${id}`);

        const planosSelecionados = (res.data.ranges || [])
          .flatMap((range) => (range.pricePlanId || []).map((p) => p.plan_id))
          .filter((v, i, a) => a.indexOf(v) === i);

        setPriceTable((prev) => ({
          ...prev,
          ...res.data,
          brands: Array.isArray(res.data.brands)
            ? res.data.brands.map((b) =>
                typeof b === "object"
                  ? {
                      Label: b.Label ?? b.label ?? "",
                      value: b.Value ?? b.value ?? b.id ?? b,
                    }
                  : { value: b }
              )
            : [],

          models: Array.isArray(res.data.models)
            ? res.data.models.map((m) =>
                typeof m === "object"
                  ? {
                      id: Number(m.id ?? m.Value ?? m.value ?? m),
                      name: m.name ?? m.Label ?? m.label ?? "",
                    }
                  : {
                      id: Number(m),
                      name: String(m),
                    }
              )
            : [],

          plansSelected: planosSelecionados,
        }));
      } catch (error) {
        console.error("Erro ao carregar a tabela:", error);
      }
    };

    fetchPriceTable();
  }, [id]);

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

    function normalizeToIds(array) {
      return (array || [])
        .map((item) => {
          if (typeof item === "number") return item;
          if (typeof item === "object") {
            return Number(item.value ?? item.Value ?? item.id ?? item.ID);
          }
          return Number(item);
        })
        .filter((id) => !isNaN(id));
    }

    const brandsIds = normalizeToIds(priceTable.brands);
    const modelsIds = normalizeToIds(priceTable.models);

    const formattedRanges = priceTable.ranges.map((range) => ({
      ...range,
      pricePlanId: (range.pricePlanId || []).map(({ plan_id, basePrice }) => ({
        plan_id,
        basePrice: Number(basePrice) || 0,
      })),
    }));

    const payload = {
      vehicle_type_id: priceTable.vehicle_type_id,
      name: priceTable.name,
      category_id: priceTable.category_id,
      brands: brandsIds,
      models: modelsIds,
      ranges: formattedRanges,
      plansSelected: priceTable.plansSelected || [],
    };

    try {
      if (id) {
        await useHttp.patch(`/price-tables/edit/${id}`, payload);
      } else {
        await useHttp.post("/price-tables/create/", payload);
      }
      navigate("/tabelas");
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
