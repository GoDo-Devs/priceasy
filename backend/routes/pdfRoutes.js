import express from "express";
import nodemailer from "nodemailer";
import { generatePdf } from "../services/pdfGenerator.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function buildFilename(simulation) {
  return simulation?.id
    ? `proposta_${simulation.id}.pdf`
    : `proposta_${Date.now()}.pdf`;
}

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

    const filename = buildFilename(simulation);

    let pdfBuffer;
    try {
      pdfBuffer = await generatePdf({
        client,
        simulation,
        rangeDetails,
        consultant,
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      return res.status(500).send({ error: "Erro ao gerar PDF." });
    }

    if (action === "download") {
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
            filename,
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

    return res.status(200).send({ message: "PDF pronto." });
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

    const filename = buildFilename(simulation);

    let pdfBuffer;
    try {
      pdfBuffer = await generatePdf({
        client,
        simulation,
        rangeDetails,
        consultant,
      });
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      return res.status(500).send({ error: "Erro ao gerar PDF." });
    }

    if (action === "download") {
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
        html: `
          <p>Olá ${consultant?.name || ""},</p>
          <p>Segue em anexo a cotação solicitada para o cliente <strong>${
            client?.name || "N/D"
          }</strong>.</p>
          <p>Atenciosamente,<br>Equipe ClubPró</p>
        `,
        attachments: [
          {
            filename,
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
