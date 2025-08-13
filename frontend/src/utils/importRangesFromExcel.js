import * as XLSX from "xlsx";

export function importRangesFromExcel(file, setPriceTable) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const allRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: true,
    });

    const headerIndex = allRows.findIndex(
      (row) =>
        Array.isArray(row) &&
        row.some((cell) => String(cell).toUpperCase().includes("VALOR_MENOR"))
    );

    if (headerIndex === -1) {
      console.error("Cabeçalho com 'VALOR_MENOR' não encontrado.");
      return;
    }

    const headerRow = allRows[headerIndex];

    const planHeaders = headerRow
      .slice(9)
      .map((text) => {
        const match = String(text).match(/\b(\d+)\b/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    const json = XLSX.utils.sheet_to_json(worksheet, {
      header: [
        "VALOR_MENOR",
        "VALOR_MAIOR",
        "COTA",
        "TAXA_ADMINISTRATIVA",
        "ADESAO",
        "RASTREADOR",
        "INSTALACAO",
        "TIPO_FRANQUIA",
        "VALOR_FRANQUIA",
        ...planHeaders,
      ],
      range: headerIndex + 1,
      raw: true,
    });

    const importedRanges = json
      .filter((row) => {
        return Object.values(row).some(
          (value) =>
            value !== null && value !== undefined && String(value).trim() !== ""
        );
      })
      .map((row) => {
        const min = Number(row["VALOR_MENOR"]);
        const max = Number(row["VALOR_MAIOR"]);
        const quota = Number(row["COTA"]);
        const accession = Number(row["ADESAO"]);
        const hasTracker = Number(row["RASTREADOR"]) === 1;
        const installationPrice = hasTracker
          ? Number(row["INSTALACAO"])
          : undefined;
        const franchiseType = row["TIPO_FRANQUIA"];
        const isFranchisePercentage = franchiseType === "%";
        const franchiseValue = Number(row["VALOR_FRANQUIA"]);

        const pricePlanId = planHeaders.map((planId) => ({
          plan_id: Number(planId),
          basePrice: Number(row[planId]),
        }));

        const basePrice =
          pricePlanId.length > 0 ? pricePlanId[0].basePrice : undefined;

        return {
          min,
          max,
          quota,
          basePrice,
          accession,
          installationPrice,
          isFranchisePercentage,
          franchiseValue,
          pricePlanId,
        };
      })
      .filter((item) => {
        return (
          !isNaN(item.min) &&
          !isNaN(item.max) &&
          !isNaN(item.quota) &&
          !isNaN(item.accession) &&
          !isNaN(item.franchiseValue) &&
          !isNaN(item.basePrice) &&
          item.pricePlanId.some((p) => !isNaN(p.basePrice))
        );
      });

    setPriceTable((prev) => ({
      ...prev,
      ranges: importedRanges,
      plansSelected: planHeaders.map(Number),
    }));
  };

  reader.readAsArrayBuffer(file);
}
