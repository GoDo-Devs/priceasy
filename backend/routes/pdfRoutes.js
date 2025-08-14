import express from "express";
import nodemailer from "nodemailer";
import { generatePdf } from "../services/pdfGenerator.js";
import crypto from "crypto";
import {
  checkIfExists,
  uploadPdfToS3,
  getPdfFromS3,
  uploadMetaToS3,
  getMetaFromS3,
} from "../services/S3.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASSWORD,
  },
});

router.post("/update", async (req, res) => {
  try {
    const {
      client,
      simulation,
      rangeDetails = {},
      consultant,
      action,
    } = req.body;

    if (!client || !simulation || !simulation.id) {
      return res.status(400).send("Dados incompletos.");
    }

    const key = `propostas/proposta_${simulation.id}.pdf`;
    const metaKey = `propostas/proposta_${simulation.id}.meta.json`;

    // Gerar hash atual da simulação
    // Depois — inclui todos os dados relevantes
    const hash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          client,
          simulation,
          rangeDetails,
          consultant,
        })
      )
      .digest("hex");

    // Buscar hash salvo no S3
    const meta = await getMetaFromS3(metaKey);
    const storedHash = meta?.hash;

    let pdfBuffer;

    if (!storedHash) {
      // Nunca existiu — criar novo
      pdfBuffer = await generatePdf({
        client,
        simulation,
        rangeDetails,
        consultant,
      });
      await uploadPdfToS3(key, pdfBuffer);
      await uploadMetaToS3(metaKey, hash);
    } else if (storedHash !== hash) {
      // Simulação mudou — atualizar PDF e hash
      pdfBuffer = await generatePdf({
        client,
        simulation,
        rangeDetails,
        consultant,
      });
      await uploadPdfToS3(key, pdfBuffer);
      await uploadMetaToS3(metaKey, hash);
    } else {
      // Nada mudou — pegar PDF do S3
      pdfBuffer = await getPdfFromS3(key);
    }

    // Download ou Email
    if (action === "download") {
      const filename = key.split("/").pop();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length,
      });
      return res.send(Buffer.from(pdfBuffer));
    }

    if (action === "sendEmail") {
      if (!consultant?.email) {
        return res.status(400).send("Email do consultor não informado.");
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: consultant.email,
        subject: "Nova cotação atualizada",
        html: `
          <p>Olá ${consultant?.name || ""},</p>
          <p>Segue em anexo a cotação atualizada para o cliente <strong>${
            client?.name || "N/D"
          }</strong>.</p>
        `,
        attachments: [
          {
            filename: key.split("/").pop(),
            content: Buffer.from(pdfBuffer),
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "Email enviado com sucesso:",
        consultant.email,
        info.messageId
      );

      return res.status(200).send({ message: "Email enviado com sucesso." });
    }

    return res.status(200).send({ message: "PDF pronto.", url: key });
  } catch (err) {
    console.error("Erro no endpoint /pdf/update:", err);
    return res.status(500).send({ error: err.message || "Erro interno" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const {
      client,
      simulation,
      rangeDetails = {},
      consultant,
      action,
    } = req.body;

    if (!client || !simulation) {
      return res.status(400).send("Dados incompletos para gerar o PDF.");
    }

    const key = simulation?.id
      ? `propostas/proposta_${simulation.id}.pdf`
      : `propostas/proposta_${Date.now()}.pdf`;

    let pdfBuffer;

    const exists = await checkIfExists(key);
    if (exists) {
      pdfBuffer = await getPdfFromS3(key);
    } else {
      pdfBuffer = await generatePdf({
        client,
        simulation,
        rangeDetails,
        consultant,
      });

      await uploadPdfToS3(key, pdfBuffer);
    }

    if (action === "download") {
      const filename = key.split("/").pop();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length,
      });
      return res.send(Buffer.from(pdfBuffer));
    }

    if (action === "sendEmail") {
      if (!consultant?.email) {
        return res.status(400).send("Email do consultor não informado.");
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: consultant.email,
        subject: "Nova cotação gerada",
        text: "Olá! Segue em anexo a cotação solicitada.",
        html: `
    <p>Olá ${consultant?.name || ""},</p>
    <p>Segue em anexo a cotação solicitada para o cliente <strong>${
      client?.name || "N/D"
    }</strong>.</p>
    <p>Atenciosamente,<br>Equipe ClubPró</p>
  `,
        attachments: [
          {
            filename: key.split("/").pop(),
            content: Buffer.from(pdfBuffer),
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(
        "Email enviado com sucesso para:",
        consultant.email,
        info.messageId
      );

      return res.status(200).send({ message: "Email enviado com sucesso." });
    }

    return res.status(400).send({ error: "Parâmetro action inválido." });
  } catch (err) {
    console.error("Erro no endpoint /pdf/generate:", err);
    return res.status(500).send({ error: err.message || "Erro interno" });
  }
});

export default router;
