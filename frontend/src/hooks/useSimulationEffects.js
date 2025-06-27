import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import { useSimulation } from "@/contexts/SimulationContext.jsx";

export default function useSimulationEffects() {
  const { simulation, setSimulation, setClient } = useSimulation();

  const [vehicleType, setVehicleType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [year, setYear] = useState([]);
  const [priceTableNames, setPriceTableNames] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    useHttp
      .get(`/vehicle-types`)
      .then((res) => setVehicleType(res.data.vehicleTypes))
      .catch((err) =>
        console.error("Erro ao carregar categorias do veículo:", err)
      );
  }, []);

  useEffect(() => {
    setBrand([]);
    setModel([]);
    setYear([]);
    setSimulation((prev) => ({
      ...prev,
      brand: "",
      model: "",
      year: "",
      vehicle_type_id: prev.vehicle_type_id,
    }));

    if (simulation.vehicle_type_id && simulation.vehicle_type_id !== 4) {
      useHttp
        .post(`/fipe/brands`, { vehicleType: simulation.vehicle_type_id })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.Value,
            label: brand.Label,
          }));
          setBrand(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar marcas do veículo:", err)
        );
    }
  }, [simulation.vehicle_type_id]);

  useEffect(() => {
    setModel([]);
    setYear([]);
    setSimulation((prev) => ({ ...prev, model: "", year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/models`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand),
        })
        .then((res) => {
          const options = res.data.models.map((model) => ({
            value: model.Value,
            label: model.Label,
          }));
          setModel(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar modelos do veículo:", err)
        );
    }
  }, [simulation.brand]);

  useEffect(() => {
    setYear([]);
    setSimulation((prev) => ({ ...prev, year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.model &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/years`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand),
          modelCode: simulation.model,
        })
        .then((res) => {
          const options = res.data.years.map((year) => ({
            value: year.value,
            label:
              year.anoModelo === 32000 ? "Zero KM" : year.anoModelo.toString(),
            tipoCombustivel: year.tipoCombustivel,
          }));
          setYear(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar anos do veículo:", err)
        );
    }
  }, [simulation.model]);

  useEffect(() => {
    if (
      simulation.vehicle_type_id &&
      simulation.brand &&
      simulation.model &&
      simulation.year &&
      simulation.vehicle_type_id !== 4
    ) {
      const [yearValue, fuelType] = simulation.year.split("-");

      useHttp
        .post(`/fipe/price`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: simulation.brand,
          modelCode: simulation.model,
          modelYear: yearValue,
          fuelType: parseInt(fuelType),
        })
        .then((res) => {
          setSimulation((prev) => ({
            ...prev,
            fuelType: parseInt(fuelType),
            modelYear: parseInt(yearValue),
            fipeCode: res.data.consultResult.CodigoFipe,
            fipeValue: res.data.consultResult.Valor,
            name: res.data.consultResult.Modelo,
          }));
        })
        .catch((err) =>
          console.error("Erro ao carregar o preço do veículo:", err)
        );
    }
  }, [simulation.year]);

  useEffect(() => {
    if (simulation.model) {
      useHttp
        .post("/price-tables/model", { model: simulation.model_id })
        .then((res) => {
          const options = (res.data.priceTables || []).map((table) => ({
            value: table.id,
            label: table.name,
          }));
          setPriceTableNames(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar nomes das tabelas de preço:", err)
        );
    } else {
      setPriceTableNames([]);
    }
  }, [simulation.model_id]);

  useEffect(() => {
    if (
      simulation.fipeValue &&
      (simulation.protectedValue === undefined ||
        simulation.protectedValue === "")
    ) {
      setSimulation((prev) => ({
        ...prev,
        protectedValue: simulation.fipeValue,
      }));
    }
  }, [simulation.fipeValue]);

  useEffect(() => {
    if (
      simulation.price_table_id !== null &&
      simulation.price_table_id !== undefined &&
      simulation.protectedValue
    ) {
      const vehiclePriceFormatted =
        typeof simulation.protectedValue === "number"
          ? simulation.protectedValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : simulation.protectedValue;

      const payload = {
        price_table_id: simulation.price_table_id,
        vehiclePrice: vehiclePriceFormatted,
        model_id: simulation.model_id,
      };

      console.log("🔍 Enviando para /price-tables/plans:", payload);

      useHttp
        .post("/price-tables/plans", payload)
        .then((res) => {
          setPlans(res.data.plans || []);
        })
        .catch((err) =>
          console.error("Erro ao carregar nomes das tabelas de preço:", err)
        );
    } else {
      setPlans([]);
    }
  }, [simulation.price_table_id, simulation.protectedValue]);

  return {
    vehicleType,
    brand,
    model,
    year,
    priceTableNames,
    plans,
  };
}
