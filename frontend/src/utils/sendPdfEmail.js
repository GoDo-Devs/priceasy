import useHttp from "@/services/useHttp";

export async function sendPdfEmail(
  client,
  simulation,
  rangeDetails,
  consultant
) {
  try {
    const response = await useHttp.post("/pdf/generate", {
      client,
      simulation,
      rangeDetails,
      consultant,
      action: "sendEmail",
    });

    return response.data; 
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    throw err; 
  }
}
