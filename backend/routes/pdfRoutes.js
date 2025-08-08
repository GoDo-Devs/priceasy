import express from "express";
import nodemailer from "nodemailer";
import { generatePdf } from "../services/pdfGenerator.js";
import { checkIfExists, uploadPdfToS3, getPdfFromS3 } from "../services/S3.js";

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
      console.log("Email enviado com sucesso para:", consultant.email, info.messageId,);

      return res.status(200).send({ message: "Email enviado com sucesso." });
    }

    return res.status(400).send({ error: "Parâmetro action inválido." });
  } catch (err) {
    console.error("Erro no endpoint /pdf/generate:", err);
    return res.status(500).send({ error: err.message || "Erro interno" });
  }
});

export default router;
