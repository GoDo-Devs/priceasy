import AutoCompleteInput from "../../components/Form/AutoCompleteInput";
import useFetch from "@/hooks/useFetch.js";

function Price() {
  const { data: products } = useFetch("products");
  const { data: vehicleTypes } = useFetch("vehicle-types");
  const { data: implementsList } = useFetch("implements");
  const { data: brands } = useFetch("brands");
  const { data: models } = useFetch("models");
  const { data: years } = useFetch("years");
  return (
    <>
      <AutoCompleteInput
        label="Produtos"
        options={products}
      ></AutoCompleteInput>
      <AutoCompleteInput
        label="Tipos de Veículo"
        options={vehicleTypes}
      ></AutoCompleteInput>
      <AutoCompleteInput
        label="Implementos"
        options={implementsList}
      ></AutoCompleteInput>
      <AutoCompleteInput label="Marcas" options={brands}></AutoCompleteInput>
      <AutoCompleteInput label="Modelos" options={models}></AutoCompleteInput>
      <AutoCompleteInput label="Anos" options={years}></AutoCompleteInput>
    </>
  );
}

export default Price;
