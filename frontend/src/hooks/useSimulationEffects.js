import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import { useSimulation } from "@/contexts/SimulationContext.jsx";

export default function useSimulationEffects() {
  const { simulation, setSimulation, client, setClient } = useSimulation();

  const [vehicleType, setVehicleType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [year, setYear] = useState([]);
  const [priceTableNames, setPriceTableNames] = useState([]);
  const [plans, setPlans] = useState([]);
  const [rangeDetails, setRangeDetails] = useState({});

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
    setSimulation((prev) => ({ ...prev, model_id: "", year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand_id &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/models`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand_id),
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
  }, [simulation.brand_id]);

  useEffect(() => {
    setYear([]);
    setSimulation((prev) => ({ ...prev, year: "" }));

    if (
      simulation.vehicle_type_id &&
      simulation.brand_id &&
      simulation.model_id &&
      simulation.vehicle_type_id !== 4
    ) {
      useHttp
        .post(`/fipe/years`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: parseInt(simulation.brand_id),
          modelCode: simulation.model_id,
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
  }, [simulation.model_id]);

  useEffect(() => {
    if (
      simulation.vehicle_type_id &&
      simulation.brand_id &&
      simulation.model_id &&
      simulation.year &&
      simulation.vehicle_type_id !== 4
    ) {
      const [yearValue, fuelType] = simulation.year.split("-");

      useHttp
        .post(`/fipe/price`, {
          vehicleType: simulation.vehicle_type_id,
          brandCode: simulation.brand_id,
          modelCode: simulation.model_id,
          modelYear: yearValue,
          fuelType: parseInt(fuelType),
        })
        .then((res) => {
          const rawValue = res.data.consultResult.Valor;
          const numericValue = Number(
            rawValue
              .replace("R$", "")
              .replace(/\./g, "")
              .replace(",", ".")
              .trim()
          );

          setSimulation((prev) => ({
            ...prev,
            fuelType: parseInt(fuelType),
            modelYear: parseInt(yearValue),
            fipeCode: res.data.consultResult.CodigoFipe,
            fipeValue: numericValue,
            name: res.data.consultResult.Modelo,
          }));
        })
        .catch((err) =>
          console.error("Erro ao carregar o preço do veículo:", err)
        );
    }
  }, [simulation.year]);

  useEffect(() => {
    if (simulation.model_id) {
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
    setSimulation((prev) => ({
      ...prev,
      protectedValue: "",
    }));
  }, [simulation.model_id, simulation.year]);

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
        plan_id: simulation.plan_id,
      };

      useHttp
        .post("/price-tables/plans", payload)
        .then((res) => {
          setPlans(res.data.plans || []);
          setRangeDetails(res.data.rangeDetails || {});
        })
        .catch((err) =>
          console.error("Erro ao carregar nomes das tabelas de preço:", err)
        );
    } else {
      setPlans([]);
    }
  }, [
    simulation.price_table_id,
    simulation.protectedValue,
    simulation.plan_id,
  ]);

  console.log(simulation);

  const saveSimulation = async () => {
    try {
      let clientId = null;

      console.log("Buscando cliente pelo CPF:", client.cpf);

      try {
        const clientRes = await useHttp.post("/clients/cpf", {
          cpf: client.cpf,
        });
        clientId = clientRes.data.id;
        console.log("Cliente encontrado, ID:", clientId);
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("Cliente não encontrado, criando novo cliente...");
          const createRes = await useHttp.post("/clients/create", {
            name: client.name,
            cpf: client.cpf,
            phone: client.phone,
          });
          clientId = clientId = createRes.data.client.id;
          console.log("Cliente criado, ID:", clientId);

          await new Promise((r) => setTimeout(r, 200));
        } else {
          throw err;
        }
      }

      if (!client.name || !client.cpf || !client.phone) {
        throw new Error(
          "Dados do cliente incompletos. Preencha nome, CPF e telefone."
        );
      }

      const selectedProductsArray = Object.entries(
        simulation.selectedProducts || {}
      ).map(([product_id, quantity]) => ({
        product_id: Number(product_id),
        quantity,
      }));

      const simulationPayload = {
        client_id: clientId,
        vehicle_type_id: simulation.vehicle_type_id,
        brand_id: Number(simulation.brand_id),
        model_id: simulation.model_id,
        year: simulation.year,
        price_table_id: simulation.price_table_id,
        protectedValue: simulation.protectedValue,
        selectedProducts: selectedProductsArray,
        plan_id: simulation.plan_id,
        monthlyFee: simulation.monthlyFee,
        implementList: simulation.implementList ?? [],
      };

      console.log("Payload da simulação:", simulationPayload);

      await useHttp.post("/simulations/create", simulationPayload);

      console.log("Cotação salva com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar a simulação:", err);
    }
  };

  return {
    vehicleType,
    brand,
    model,
    year,
    priceTableNames,
    plans,
    rangeDetails,
    saveSimulation,
  };
}
