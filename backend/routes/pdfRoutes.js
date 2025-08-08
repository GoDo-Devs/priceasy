import express from "express";
import nodemailer from "nodemailer";
import { generatePdf } from "../services/pdfGenerator.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 465,
  secure: true,
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

    const pdfBuffer = await generatePdf({
      client,
      simulation,
      rangeDetails,
      consultant,
    });

    if (action === "download") {
      const filename = simulation?.id
        ? `proposta_${simulation.id}_completo.pdf`
        : "proposta_completa.pdf";

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
        text: "Segue em anexo a cotação gerada.",
        attachments: [
          {
            filename: simulation?.id
              ? `proposta_${simulation.id}.pdf`
              : "proposta.pdf",
            content: Buffer.from(pdfBuffer),
            contentType: "application/pdf",
          },
        ],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso:", info.messageId);

      return res.status(200).send({ message: "Email enviado com sucesso." });
    }

    return res.status(400).send({ error: "Parâmetro action inválido." });
  } catch (err) {
    console.error("Erro no endpoint /pdf/generate:", err);
    return res.status(500).send({ error: err.message || "Erro interno" });
  }
});

export default router;
