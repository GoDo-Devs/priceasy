import axios from "axios";

class FipeTableService {
  http;
  referenceTable;

  constructor() {
    this.http = new axios.create({
      baseURL: "https://veiculos.fipe.org.br/api/veiculos",
    });
  }

  async setReferenceTable() {
    const response = await this.http.post("/ConsultarTabelaDeReferencia");

    this.checkErrors(response.data);

    this.referenceTable = response.data[0]["Codigo"];
  }

  async searchBrands(vehicleTypeCode) {
    const response = await this.http.post("/ConsultarMarcas", {
      codigoTabelaReferencia: this.referenceTable,
      codigoTipoVeiculo: vehicleTypeCode,
    });

    this.checkErrors(response.data);

    return response.data;
  }

  async searchModels(vehicleTypeCode, brandCode) {
    const response = await this.http.post("/ConsultarModelos", {
      codigoTabelaReferencia: this.referenceTable,
      codigoTipoVeiculo: vehicleTypeCode,
      codigoMarca: brandCode,
    });

    this.checkErrors(response.data);

    return response.data;
  }

  async searchModelYear(vehicleTypeCode, brandCode, modelCode) {
    const response = await this.http.post("/ConsultarAnoModelo", {
      codigoTabelaReferencia: this.referenceTable,
      codigoTipoVeiculo: vehicleTypeCode,
      codigoMarca: brandCode,
      codigoModelo: modelCode,
    });

    this.checkErrors(response.data);

    const yearWithFuel = response.data.map((yearFuel) => {
      const [year, fuel] = yearFuel["Value"].split("-");

      return {
        value: yearFuel["Value"],
        anoModelo: Number(year),
        tipoCombustivel: Number(fuel)
      };
    });

    return yearWithFuel;
  }

  async searchFipePrice(
    vehicleTypeCode,
    brandCode,
    modelCode,
    modelYear,
    fuelType
  ) {
    const response = await this.http.post("/ConsultarValorComTodosParametros", {
      codigoTabelaReferencia: this.referenceTable,
      codigoTipoVeiculo: vehicleTypeCode,
      codigoMarca: brandCode,
      codigoModelo: modelCode,
      anoModelo: modelYear,
      codigoTipoCombustivel: fuelType,
      tipoConsulta: "tradicional",
    });

    this.checkErrors(response.data);

    return response.data;
  }

  checkErrors(response) {
    const error = response["erro"];

    if (error) {
      throw new Error(`Erro ao consultar Tabela Fipe ${error}`);
    }
  }
}

export default FipeTableService;
