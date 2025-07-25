import express from "express";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const router = express.Router();

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
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template não encontrado: ${fileName}`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

router.post("/generate", async (req, res) => {
  try {
    console.log(
      "Recebido body para gerar PDF:",
      JSON.stringify(req.body, null, 2)
    );

    const { client, simulation, rangeDetails = {}, consultant } = req.body;

    if (!client || !simulation) {
      return res.status(400).send("Dados incompletos para gerar o PDF.");
    }

    const nomeCliente = client.name?.toUpperCase?.() || "CLIENTE";
    const placa =
      simulation.plate && simulation.plate.trim()
        ? `(placa ${simulation.plate.toUpperCase()})`
        : "";
    const fipeCode = simulation.fipeCode || "";
    const veiculoDesc = `${simulation.name?.toUpperCase() || ""} ${
      simulation.modelYear || ""
    }${fipeCode ? ` (FIPE: ${fipeCode})` : ""}`.trim();

    const protectedValue = formatCurrency(simulation.protectedValue);

    const planName = simulation.plan?.name || "PLANO DESCONHECIDO";
    const cobertura = simulation.plan?.cobertura || [];
    const assist24 = simulation.plan?.assist24 || [];

    const implementList = simulation.implementList || [];
    const selectedProducts = simulation.selectedProducts || {};
    const allProducts = simulation.products || [];
    const { monthlyFee } = simulation;

    const consultantName = consultant?.name?.toUpperCase() || "-";
    const consultantEmail = consultant?.email || "-";

    const generateListRows = (items) =>
      items
        .map(
          (item) =>
            `<tr><td colspan="2" style="padding: 4px 8px;">${item}</td></tr>`
        )
        .join("");

    const generateImplementRows = () =>
      implementList
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td>${formatCurrency(i.price)}</td></tr>`
        )
        .join("");

    const generateProductRows = () => {
      if (Array.isArray(selectedProducts)) {
        return selectedProducts
          .map(({ product_id }) => {
            const p = allProducts.find(
              (p) => String(p.id) === String(product_id)
            );
            return `<tr><td>${
              p?.name || "Produto " + product_id
            }</td><td>${formatCurrency(p?.price || 0)}</td></tr>`;
          })
          .join("");
      } else {
        return Object.entries(selectedProducts)
          .map(([id]) => {
            const p = allProducts.find((p) => String(p.id) === id);
            return `<tr><td>${
              p?.name || "Produto " + id
            }</td><td>${formatCurrency(p?.price || 0)}</td></tr>`;
          })
          .join("");
      }
    };

    const coberturaRows = generateListRows(cobertura);
    const assistenciasRows = generateListRows(assist24);

    const planTable = loadTemplate("table-plan.html")
      .replace("{{PLAN_NAME}}", planName)
      .replace("{{COBERTURAS}}", coberturaRows)
      .replace("{{ASSISTENCIAS}}", assistenciasRows);

    const implementTable = implementList.length
      ? loadTemplate("table-implements.html").replace(
          "{{IMPLEMENTOS}}",
          generateImplementRows()
        )
      : "";

    const productsTable = (
      Array.isArray(selectedProducts)
        ? selectedProducts.length
        : Object.keys(selectedProducts).length
    )
      ? loadTemplate("table-products.html").replace(
          "{{PRODUTOS}}",
          generateProductRows()
        )
      : "";

    const quoteTable = loadTemplate("table-quote.html")
      .replace("{{MENSALIDADE_REAL}}", formatCurrency(monthlyFee))
      .replace(
        "{{MENSALIDADE_DESCONTO}}",
        formatValueWithDiscount(monthlyFee, simulation.discountedMonthlyFee)
      )
      .replace(
        "{{TAXA_MATRICULA_REAL}}",
        formatCurrency(rangeDetails.accession)
      )
      .replace(
        "{{TAXA_MATRICULA_DESCONTO}}",
        formatValueWithDiscount(
          rangeDetails.accession,
          simulation.discountedAccession
        )
      )
      .replace(
        "{{COTA_PARTICIPACAO_REAL}}",
        formatPercentage(rangeDetails.franchiseValue)
      )
      .replace(
        "{{COTA_PARTICIPACAO_DESCONTO}}",
        formatValueWithDiscount(
          rangeDetails.franchiseValue,
          simulation.discountedFranchiseValue,
          true
        )
      )
      .replace(
        "{{RASTREADOR_REAL}}",
        formatCurrency(rangeDetails.installationPrice)
      )
      .replace(
        "{{RASTREADOR_DESCONTO}}",
        formatValueWithDiscount(
          rangeDetails.installationPrice,
          simulation.discountedInstallationPrice
        )
      );

    const consultantTable = loadTemplate("table-consultant.html")
      .replace("{{CONSULTOR_NOME}}", consultantName)
      .replace("{{CONSULTOR_EMAIL}}", consultantEmail);

    const baseHtml = loadTemplate("base.html")
      .replace("{{LOGO_BASE64}}", logoBase64)
      .replace("{{ID_SIMULACAO}}", simulation.id || "sem-id")
      .replace(
        "{{DATA}}",
        new Date(simulation.createdAt || Date.now()).toLocaleDateString(
          "pt-BR",
          { day: "2-digit", month: "2-digit" }
        )
      )
      .replace("{{NOME_CLIENTE}}", nomeCliente)
      .replace("{{PLACA}}", placa)
      .replace("{{VEICULO_DESC}}", veiculoDesc)
      .replace("{{VALOR_FIPE}}", protectedValue)
      .replace("{{TABLE_PLAN}}", planTable)
      .replace("{{TABLE_IMPLEMENT}}", implementTable)
      .replace("{{TABLE_PRODUCTS}}", productsTable)
      .replace("{{TABLE_QUOTE}}", quoteTable)
      .replace("{{TABLE_CONSULTANT}}", consultantTable);

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

    const proposta1Path = path.join(assetsDir, "proposta1.pdf");
    const proposta2Path = path.join(assetsDir, "proposta2.pdf");
    const proposta3Path = path.join(assetsDir, "proposta3.pdf");

    if (
      !fs.existsSync(proposta1Path) ||
      !fs.existsSync(proposta2Path) ||
      !fs.existsSync(proposta3Path)
    ) {
      return res
        .status(500)
        .send("Arquivos de propostas não encontrados na pasta assets.");
    }

    const proposta1Bytes = fs.readFileSync(proposta1Path);
    const proposta2Bytes = fs.readFileSync(proposta2Path);
    const proposta3Bytes = fs.readFileSync(proposta3Path);

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

    const mergedPdfBytes = await mergedPdf.save();

    const filename = simulation?.id
      ? `proposta_${simulation.id}_completo.pdf`
      : `proposta_completa.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": mergedPdfBytes.length,
    });

    res.send(Buffer.from(mergedPdfBytes));
  } catch (err) {
    console.error("Erro ao gerar e unir PDFs:", err);
    res.status(500).send({
      error: "Erro interno ao gerar o PDF completo",
      message: err.message,
    });
  }
});

export default router;
