import express from "express";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const router = express.Router();

const logoPath = new URL("../assets/logo.png", import.meta.url).pathname;
const logoBase64 = fs.readFileSync(logoPath).toString("base64");

const templatesDir = path.resolve("templates");

function formatCurrency(value) {
  if (value == null) return "-";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function loadTemplate(fileName) {
  return fs.readFileSync(path.join(templatesDir, fileName), "utf-8");
}

router.post("/generate", async (req, res) => {
  try {
    const { client, simulation, rangeDetails = {} } = req.body;

    if (!client || !simulation) {
      return res.status(400).send("Dados incompletos para gerar o PDF.");
    }

    const nomeCliente = client.name?.toUpperCase?.() || "CLIENTE";
    const veiculoDesc = `${simulation.name?.toUpperCase() || ""} ${
      simulation.modelYear || ""
    }`;
    const fipeCode = simulation.fipeCode || "";
    const valorFipe = formatCurrency(simulation.fipeValue);
    const planName = simulation.plan?.name || "PLANO DESCONHECIDO";
    const cobertura = simulation.plan?.cobertura || [];
    const assist24 = simulation.plan?.assist24 || [];
    const implementList = simulation.implementList || [];
    const selectedProducts = simulation.selectedProducts || {};
    const allProducts = simulation.products || [];
    const { monthlyFee } = simulation;

    const generateListRows = (items) =>
      items.map((item) => `<tr><td>${item}</td></tr>`).join("");

    const generateImplementRows = () =>
      implementList
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td>${formatCurrency(i.price)}</td></tr>`
        )
        .join("");

    const generateProductRows = () =>
      Object.entries(selectedProducts)
        .map(([id]) => {
          const p = allProducts.find((p) => String(p.id) === id);
          return `<tr><td>${
            p?.name || "Produto " + id
          }</td><td>${formatCurrency(p?.price || 0)}</td></tr>`;
        })
        .join("");

    const planTable = loadTemplate("table-plan.html")
      .replace("{{PLAN_NAME}}", planName)
      .replace("{{COBERTURAS}}", generateListRows(cobertura))
      .replace("{{ASSISTENCIAS}}", generateListRows(assist24));

    const implementTable = implementList.length
      ? loadTemplate("table-implements.html").replace(
          "{{IMPLEMENTOS}}",
          generateImplementRows()
        )
      : "";

    const productsTable = Object.keys(selectedProducts).length
      ? loadTemplate("table-products.html").replace(
          "{{PRODUTOS}}",
          generateProductRows()
        )
      : "";

    const quoteTable = loadTemplate("table-quote.html")
      .replace("{{MENSALIDADE}}", formatCurrency(monthlyFee))
      .replace("{{TAXA_MATRICULA}}", formatCurrency(rangeDetails.accession))
      .replace(
        "{{COTA_PARTICIPACAO}}",
        rangeDetails.isFranchisePercentage
          ? `${rangeDetails.franchiseValue}%`
          : formatCurrency(rangeDetails.franchiseValue)
      )
      .replace(
        "{{RASTREADOR}}",
        formatCurrency(rangeDetails.installationPrice)
      );

    const baseHtml = loadTemplate("base.html")
      .replace("{{LOGO_BASE64}}", logoBase64)
      .replace("{{ID_SIMULACAO}}", simulation.id || "sem-id")
      .replace(
        "{{DATA}}",
        new Date(simulation.createdAt || Date.now()).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
          }
        )
      )
      .replace("{{NOME_CLIENTE}}", nomeCliente)
      .replace("{{VEICULO_DESC}}", veiculoDesc)
      .replace("{{FIPE_CODE}}", fipeCode)
      .replace("{{VALOR_FIPE}}", valorFipe)
      .replace("{{TABLE_PLAN}}", planTable)
      .replace("{{TABLE_IMPLEMENT}}", implementTable)
      .replace("{{TABLE_PRODUCTS}}", productsTable)
      .replace("{{TABLE_QUOTE}}", quoteTable);

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

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=proposta_${
        simulation.id || "cliente"
      }.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    res.status(500).send("Erro interno ao gerar PDF.");
  }
});

export default router;
