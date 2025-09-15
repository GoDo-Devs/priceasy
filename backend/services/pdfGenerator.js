import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const logoPath = new URL("../assets/logo.png", import.meta.url).pathname;
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

const templatesDir = path.resolve("templates");
const assetsDir = path.resolve("assets");

function formatCurrency(value) {
  if (value == null) return "-";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercentage(value) {
  if (value == null) return "-";
  return `${value}%`;
}

function formatValueWithDiscount(real, discounted, isPercentage = false) {
  const formatFn = isPercentage ? formatPercentage : formatCurrency;
  if (discounted == null || Number(discounted) === Number(real)) {
    return formatFn(real);
  } else {
    return `
      ${formatFn(discounted)}&nbsp;
      <span style="text-decoration: line-through;">${formatFn(real)}</span>
    `;
  }
}

function loadTemplate(fileName) {
  const filePath = path.join(templatesDir, fileName);
  if (!fs.existsSync(filePath))
    throw new Error(`Template não encontrado: ${fileName}`);
  return fs.readFileSync(filePath, "utf-8");
}

export async function generatePdf({
  client,
  simulation,
  rangeDetails = {},
  consultant,
}) {
  const nomeCliente = client.name?.toUpperCase?.() || "CLIENTE";
  const placa = simulation.plate?.trim() ? simulation.plate.toUpperCase() : "";
  const fipeCode = simulation.fipeCode || "";
  const veiculoDesc = `${simulation.name?.toUpperCase() || ""} ${
    simulation.modelYear || ""
  }${fipeCode ? ` (FIPE: ${fipeCode})` : ""}`.trim();
  const protectedValue = formatCurrency(simulation.protectedValue);

  const getValue = (key) => simulation[key] ?? rangeDetails[key] ?? null;

  // -----------------------------
  // Produtos da SIMULAÇÃO principal
  // -----------------------------
  const simulationSelectedIds = Object.values(
    simulation.selectedProducts || {}
  ).map(String);
  const simulationProductsList = (simulation.products || []).filter((p) =>
    simulationSelectedIds.includes(String(p.id))
  );

  let simulationProductsSection = "";
  if (simulationProductsList.length) {
    simulationProductsSection = `
      <tr><td colspan="2" class="plan-header">OPCIONAIS</td></tr>
      <tr><td style="font-weight:bold">Nome</td><td style="font-weight:bold">Valor</td></tr>
      ${simulationProductsList
        .map(
          (p) =>
            `<tr><td>${p.name}</td><td>${formatCurrency(p.price)}</td></tr>`
        )
        .join("")}
    `;
  }

  const mensalidade = formatValueWithDiscount(
    getValue("monthlyFee"),
    simulation.discountedMonthlyFee
  );

  const taxa = formatValueWithDiscount(
    getValue("accession"),
    simulation.discountedAccession
  );
  const cota = formatValueWithDiscount(
    getValue("franchiseValue"),
    simulation.discountedFranchiseValue,
    true
  );
  const rastreador = formatValueWithDiscount(
    getValue("installationPrice"),
    simulation.discountedInstallationPrice
  );

  const coberturaRows = (simulation.plan?.cobertura || [])
    .map((c) => `<tr><td colspan="2" style="padding:4px 8px;">${c}</td></tr>`)
    .join("");
  const assistenciasRows = (simulation.plan?.assist24 || [])
    .map((a) => `<tr><td colspan="2" style="padding:4px 8px;">${a}</td></tr>`)
    .join("");

  const unifiedQuoteTable = loadTemplate("table-quote.html")
    .replace("{{PLACA}}", placa)
    .replace("{{VEICULO_DESC}}", veiculoDesc)
    .replace("{{VALOR_FIPE}}", protectedValue)
    .replace("{{PLAN_NAME}}", simulation.plan?.name || "PLANO DESCONHECIDO")
    .replace("{{COBERTURAS}}", coberturaRows)
    .replace("{{ASSISTENCIAS}}", assistenciasRows)
    .replace("{{PRODUTOS}}", simulationProductsSection)
    .replace("{{MENSALIDADE_DESCONTO}}", mensalidade)
    .replace("{{TAXA_MATRICULA_DESCONTO}}", taxa)
    .replace("{{COTA_PARTICIPACAO_DESCONTO}}", cota)
    .replace("{{RASTREADOR_DESCONTO}}", rastreador);

  // -----------------------------
  // Produtos de cada AGREGADO
  // -----------------------------
  const aggregateTemplate = loadTemplate("table-aggregates.html");

  const aggregateProductsSection = (agg) => {
    const aggregateKey = agg.key || agg.id;
    const aggProducts = simulation.aggregatesProducts?.[aggregateKey] || [];

    if (!aggProducts.length) return "";
    return `
    <tr><td colspan="2" class="plan-header">PRODUTOS</td></tr>
    <tr><td style="font-weight:bold">Nome</td><td style="font-weight:bold">Valor</td></tr>
    ${aggProducts
      .map(
        (p) => `<tr><td>${p.name}</td><td>${formatCurrency(p.price)}</td></tr>`
      )
      .join("")}
  `;
  };

  const aggregateTable = (simulation.aggregates || [])
    .map((agg) => {
      const aggPlanData = simulation.aggregatesPlans?.find(
        (ap) => ap.aggregateId === agg.id
      );
      const aggPlanName = aggPlanData?.plan?.name || "PLANO DESCONHECIDO";
      const aggCobertura = (aggPlanData?.plan?.cobertura || [])
        .map(
          (c) => `<tr><td colspan="2" style="padding:4px 8px;">${c}</td></tr>`
        )
        .join("");
      const aggAssist24 = (aggPlanData?.plan?.assist24 || [])
        .map(
          (a) => `<tr><td colspan="2" style="padding:4px 8px;">${a}</td></tr>`
        )
        .join("");

      return aggregateTemplate
        .replace("{{NOME}}", agg.name?.toUpperCase() || "-")
        .replace("{{PLACA}}", agg.plate || "-")
        .replace("{{VALOR}}", formatCurrency(agg.value))
        .replace("{{PRECO_BASE}}", formatCurrency(agg.totalBasePrice))
        .replace(
          "{{ADESAO}}",
          formatValueWithDiscount(agg.accession, agg.discountedAccession)
        )
        .replace("{{VALOR_FRANQUIA}}", formatPercentage(agg.franchiseValue))
        .replace("{{PLAN_NAME}}", aggPlanName)
        .replace("{{COBERTURAS}}", aggCobertura)
        .replace("{{ASSISTENCIAS}}", aggAssist24)
        .replace("{{PRODUTOS}}", aggregateProductsSection(agg));
    })
    .join("");

  // -----------------------------
  // Tabela total
  // -----------------------------
  let totalTable = "";
  if (simulation.aggregates?.length) {
    const totalTableTemplate = loadTemplate("table-total.html");
    totalTable = totalTableTemplate
      .replace(
        "{{TOTAL_MENSALIDADE}}",
        formatCurrency(simulation.totalBasePrice)
      )
      .replace(
        "{{TOTAL_TAXA_MATRICULA}}",
        formatCurrency(simulation.totalAccession)
      );
  }

  // -----------------------------
  // Consultor
  // -----------------------------
  const consultantTable = loadTemplate("table-consultant.html")
    .replace("{{CONSULTOR_NOME}}", consultant?.name?.toUpperCase() || "-")
    .replace("{{CONSULTOR_EMAIL}}", consultant?.email || "-");

  // -----------------------------
  // Monta HTML final
  // -----------------------------
  const baseHtml = loadTemplate("base.html")
    .replace("{{LOGO_BASE64}}", logoBase64)
    .replace("{{ID_SIMULACAO}}", simulation.id || "sem-id")
    .replace(
      "{{DATA}}",
      new Date(simulation.createdAt || Date.now()).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    )
    .replace("{{NOME_CLIENTE}}", nomeCliente)
    .replace("{{TABLE_QUOTE}}", unifiedQuoteTable)
    .replace("{{TABLE_AGGREGATE}}", aggregateTable)
    .replace("{{TABLE_TOTAL}}", totalTable)
    .replace("{{TABLE_CONSULTANT}}", consultantTable);

  // -----------------------------
  // Gera PDF via Playwright
  // -----------------------------
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(baseHtml, { waitUntil: "networkidle" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
  });
  await browser.close();

  // -----------------------------
  // Merge PDFs adicionais
  // -----------------------------
  const proposta1Bytes = fs.readFileSync(path.join(assetsDir, "proposta1.pdf"));
  const proposta2Bytes = fs.readFileSync(path.join(assetsDir, "proposta2.pdf"));
  const proposta3Bytes = fs.readFileSync(path.join(assetsDir, "proposta3.pdf"));

  const mergedPdf = await PDFDocument.create();
  const pdfProposta1 = await PDFDocument.load(proposta1Bytes);
  const pdfCotacao = await PDFDocument.load(pdfBuffer);
  const pdfProposta2 = await PDFDocument.load(proposta2Bytes);
  const pdfProposta3 = await PDFDocument.load(proposta3Bytes);

  async function copyPages(sourcePdf) {
    const copiedPages = await mergedPdf.copyPages(
      sourcePdf,
      sourcePdf.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  await copyPages(pdfProposta1);
  await copyPages(pdfCotacao);
  await copyPages(pdfProposta2);
  await copyPages(pdfProposta3);

  return await mergedPdf.save();
}
