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

    const { client, simulation, rangeDetails = {} } = req.body;

    if (!client || !simulation) {
      return res.status(400).send("Dados incompletos para gerar o PDF.");
    }

    // Prepara dados
    const nomeCliente = client.name?.toUpperCase?.() || "CLIENTE";
    const veiculoDesc = `${simulation.name?.toUpperCase() || ""} ${
      simulation.modelYear || ""
    }`.trim();
    const fipeCode = simulation.fipeCode || "";
    const valorFipe = formatCurrency(simulation.fipeValue);
    const planName = simulation.plan?.name || "PLANO DESCONHECIDO";
    const cobertura = simulation.plan?.cobertura || [];
    const assist24 = simulation.plan?.assist24 || [];
    const implementList = simulation.implementList || [];
    const selectedProducts = simulation.selectedProducts || {};
    const allProducts = simulation.products || [];
    const { monthlyFee } = simulation;

    // Funções para gerar linhas das tabelas
    const generateListRows = (items) =>
      items.map((item) => `<tr><td>${item}</td></tr>`).join("");

    const generateImplementRows = () =>
      implementList
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td>${formatCurrency(i.price)}</td></tr>`
        )
        .join("");

    const generateProductRows = () => {
      if (Array.isArray(selectedProducts)) {
        // Caso seja array (ex: [{ product_id: 1, quantity: 2 }])
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
        // Caso seja objeto { id: quantidade }
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

    // Carrega templates e substitui placeholders
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

    // Debug: log do HTML gerado (evite logar muito em produção)
    console.log("HTML gerado para PDF:", baseHtml.substring(0, 500) + "...");

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
    if (err.stack) console.error(err.stack);
    // Retorna mensagem de erro mais detalhada no header para ajudar no frontend (cuidado em prod)
    res
      .status(500)
      .send({ error: "Erro interno ao gerar PDF", message: err.message });
  }
});

export default router;
