import { useEffect, useState } from "react";
import useHttp from "@/services/useHttp.js";
import { useSimulation } from "@/contexts/simulationContext.jsx";
import { useSearchParams } from "react-router";

const calcTotals = (sim, rangeDetails) => {
  if (!sim) return { totalBasePrice: 0, totalAccession: 0 };

  const aggregates = Array.isArray(sim.aggregates) ? sim.aggregates : [];

  const aggregatesBasePrice = aggregates.reduce(
    (sum, item) => sum + (parseFloat(item.basePrice) || 0),
    0
  );

  const aggregatesAccession = aggregates.reduce((sum, item) => {
    if (
      item.discountedAccession !== null &&
      item.discountedAccession !== undefined
    ) {
      return sum + parseFloat(item.discountedAccession || 0);
    }
    return sum;
  }, 0);

  const monthlyFeeValue = sim.discountedMonthlyFee
    ? parseFloat(sim.discountedMonthlyFee) || 0
    : parseFloat(sim.monthlyFee) || 0;

  const accessionBase = rangeDetails?.accession ?? sim.accession;

  const simAccessionValue = sim.discountedAccession
    ? parseFloat(sim.discountedAccession) || 0
    : parseFloat(accessionBase) || 0;

  return {
    totalBasePrice: aggregatesBasePrice + monthlyFeeValue,
    totalAccession: aggregatesAccession + simAccessionValue,
  };
};

export default function useSimulationEffects() {
  const {
    simulation,
    setSimulation,
    client,
    setClient,
    rangeDetails,
    setRangeDetails,
  } = useSimulation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);

  const [vehicleType, setVehicleType] = useState([]);
  const [brand, setBrand] = useState([]);
  const [model, setModel] = useState([]);
  const [year, setYear] = useState([]);
  const [priceTableNames, setPriceTableNames] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (!simulation) return;

    const { totalBasePrice, totalAccession } = calcTotals(
      simulation,
      rangeDetails
    );

    setSimulation((prev) => {
      const prevBase = Number(prev?.totalBasePrice) || 0;
      const prevAcc = Number(prev?.totalAccession) || 0;

      if (prevBase === totalBasePrice && prevAcc === totalAccession) {
        return prev;
      }

      return {
        ...prev,
        totalBasePrice: totalBasePrice.toFixed(2),
        totalAccession: totalAccession.toFixed(2),
      };
    });
  }, [
    simulation?.aggregates,
    simulation?.monthlyFee,
    simulation?.accession,
    simulation?.discountedMonthlyFee,
    simulation?.discountedAccession,
    rangeDetails,
  ]);

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

    if (
      simulation.vehicle_type_fipeCode &&
      simulation.vehicle_type_fipeCode !== 4
    ) {
      useHttp
        .post(`/fipe/brands`, { vehicleType: simulation.vehicle_type_fipeCode })
        .then((res) => {
          const options = res.data.brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }));
          setBrand(options);
        })
        .catch((err) =>
          console.error("Erro ao carregar marcas do veículo:", err)
        );
    }
  }, [simulation.vehicle_type_fipeCode]);

  useEffect(() => {
    if (
      simulation.vehicle_type_fipeCode &&
      simulation.brand_id &&
      simulation.vehicle_type_fipeCode !== 4
    ) {
      useHttp
        .post(`/fipe/models`, {
          vehicleType: simulation.vehicle_type_fipeCode,
          brandCode: simulation.brand_id,
        })
        .then((res) => {
          const options = res.data.models.map((model) => ({
            value: model.id,
            label: model.name,
          }));
          setModel(options);
        })
        .catch(console.error);
    } else {
      setModel([]);
    }
  }, [simulation.vehicle_type_fipeCode, simulation.brand_id]);

  useEffect(() => {
    if (
      simulation.vehicle_type_fipeCode &&
      simulation.brand_id &&
      simulation.model_id &&
      simulation.vehicle_type_fipeCode !== 4
    ) {
      useHttp
        .post(`/fipe/years`, {
          vehicleType: simulation.vehicle_type_fipeCode,
          brandCode: simulation.brand_id,
          modelCode: simulation.model_id,
        })
        .then((res) => {
          const options = res.data.years.map((year) => ({
            value: year.year,
            label: year.year === "32000" ? "Zero KM" : year.year,
            fuel: year.fuel,
          }));
          setYear(options);
        })
        .catch(console.error);
    } else {
      setYear([]);
    }
  }, [
    simulation.vehicle_type_fipeCode,
    simulation.brand_id,
    simulation.model_id,
  ]);

  useEffect(() => {
    if (
      Array.isArray(year) &&
      year.length > 0 &&
      simulation.year &&
      !year.find((y) => String(y.value) === String(simulation.year))
    ) {
      const selected = year.find(
        (y) =>
          String(y.value) === String(simulation.year) ||
          String(y.label) === String(simulation.year)
      );

      if (selected) {
        setSimulation((prev) => ({
          ...prev,
          year: Number(selected.value),
          modelYearLabel: selected.label,
          fuel: selected.fuel ?? "",
        }));
      }
    }
  }, [year, simulation.year]);

  useEffect(() => {
    const { brand_id, model_id, year, fuel, vehicle_type_fipeCode } =
      simulation;

    if (vehicle_type_fipeCode !== 4 && (!brand_id || !model_id || !year)) {
      setSimulation((prev) => ({
        ...prev,
        protectedValue: "",
      }));
      return;
    }

    if (brand_id && model_id && year && fuel && vehicle_type_fipeCode !== 4) {
      useHttp
        .post(`/fipe/price`, {
          vehicleType: Number(vehicle_type_fipeCode),
          brandCode: Number(brand_id),
          modelCode: Number(model_id),
          modelYear: Number(year),
          fuelType: Number(fuel),
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
            protectedValue: numericValue,
            fipeValue: numericValue,
            fipeCode: res.data.consultResult.CodigoFipe,
            name: res.data.consultResult.Modelo,
          }));
        })
        .catch((err) => {
          console.error("Erro ao carregar o preço do veículo:", err);
          setSimulation((prev) => ({
            ...prev,
            protectedValue: "",
          }));
        });
    }
  }, [
    simulation.brand_id,
    simulation.model_id,
    simulation.vehicle_type_fipeCode,
    simulation.year,
    simulation.fuel,
  ]);

  useEffect(() => {
    if (simulation.vehicle_type_fipeCode === 4) {
      useHttp
        .post("/price-tables/filter", {
          vehicle_type_id: simulation.vehicle_type_id,
        })
        .then((res) => {
          const options = (res.data.priceTables || []).map((table) => ({
            value: table.id,
            label: table.name,
          }));
          setPriceTableNames(options);
        })
        .catch(console.error);
    } else if (simulation.model_id) {
      useHttp
        .post("/price-tables/filter", { model: simulation.model_id })
        .then((res) => {
          const options = (res.data.priceTables || []).map((table) => ({
            value: table.id,
            label: table.name,
          }));
          setPriceTableNames(options);
        })
        .catch(console.error);
    } else {
      setPriceTableNames([]);
    }
  }, [
    simulation.model_id,
    simulation.vehicle_type_fipeCode,
    simulation.vehicle_type_id,
  ]);

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
    const {
      price_table_id,
      protectedValue,
      model_id,
      year,
      brand_id,
      vehicle_type_fipeCode,
    } = simulation;

    if (
      !price_table_id ||
      !protectedValue ||
      !vehicle_type_fipeCode ||
      (vehicle_type_fipeCode !== 4 && (!model_id || !year || !brand_id))
    ) {
      setPlans([]);
      setRangeDetails({});
      return;
    }

    setRangeDetails({});

    const vehiclePriceNumber =
      typeof protectedValue === "number"
        ? protectedValue
        : Number(
            String(protectedValue)
              .replace(/[^\d,.-]/g, "")
              .replace(".", "")
              .replace(",", ".")
          );

    const payload =
      vehicle_type_fipeCode === 4
        ? {
            price_table_id,
            vehiclePrice: vehiclePriceNumber,
            vehicle_type_fipeCode,
          }
        : {
            price_table_id,
            vehiclePrice: vehiclePriceNumber,
            model_id,
            vehicle_type_fipeCode,
          };

    useHttp
      .post("/price-tables/plans", payload)
      .then((res) => {
        setPlans(res.data.plans || []);
        setRangeDetails(res.data.rangeDetails || {});
      })
      .catch((err) => {
        console.error("Erro ao carregar planos:", err);
      });
  }, [
    simulation.price_table_id,
    simulation.protectedValue,
    simulation.model_id,
    simulation.year,
    simulation.brand_id,
    simulation.vehicle_type_fipeCode,
    simulation.vehicle_type_id,
  ]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await useHttp.get(`/simulations/${id}`);
        const sim = res.data;

        const selectedProducts = Array.isArray(sim.selectedProducts)
          ? Object.fromEntries(
              sim.selectedProducts.map((p) => [p.product_id, p.quantity])
            )
          : {};

        setSimulation({
          ...sim,
          selectedProducts,
        });

        if (sim.client_id) {
          const resClient = await useHttp.get(`/clients/${sim.client_id}`);
          setClient({
            name: resClient.data.name,
            cpf: resClient.data.cpf,
            phone: resClient.data.phone,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar simulação:", err);
        setLoading(false);
      }
    })();
  }, [id]);

  const saveSimulation = async (simulation, rangeDetails) => {
    try {
      let clientId = null;

      const { name, cpf, phone } = client || {};
      if (!name || !cpf || !phone) {
        throw new Error(
          "Dados do cliente incompletos. Preencha nome, CPF e telefone."
        );
      }

      if (!simulation.id) {
        try {
          const { data } = await useHttp.post("/clients/cpf", { cpf });
          clientId = data.id;
        } catch (err) {
          if (err.response?.status === 404) {
            const { data } = await useHttp.post("/clients/create", {
              name,
              cpf,
              phone,
            });
            clientId = data.client.id;
            await new Promise((r) => setTimeout(r, 200));
          } else {
            throw err;
          }
        }
      }

      const selectedProductsArray = Object.entries(
        simulation.selectedProducts || {}
      ).map(([product_id, quantity]) => ({
        product_id: Number(product_id),
        quantity,
      }));

      const totals = calcTotals(simulation);

      const simulationPayload = {
        ...simulation,
        ...totals,
        selectedProducts: selectedProductsArray,
        accession: rangeDetails.accession,
        installationPrice: rangeDetails.installationPrice,
        isFranchisePercentage: rangeDetails.isFranchisePercentage,
        franchiseValue: rangeDetails.franchiseValue,
      };

      if (!simulation.id) {
        simulationPayload.client_id = clientId;
        const { data } = await useHttp.post(
          "/simulations/create",
          simulationPayload
        );
        return data;
      } else {
        await useHttp.put(`/simulations/${simulation.id}`, simulationPayload);
        return { id: simulation.id };
      }
    } catch (err) {
      console.error("Erro ao salvar a simulação:", err);
      return false;
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
    setRangeDetails,
    saveSimulation,
    loading,
    client,
    simulation,
  };
}
