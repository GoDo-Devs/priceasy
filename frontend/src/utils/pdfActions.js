import useHttp from "@/services/useHttp";

export async function updatePdf(client, simulation, rangeDetails, consultant) {
  try {
    const response = await useHttp.post(
      "/pdf/update",
      { client, simulation, rangeDetails, consultant, action: "download" },
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const filename = simulation?.id
      ? `Proposta - ${simulation.plate}.pdf`
      : "Proposta.pdf";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erro ao atualizar PDF:", err);
  }
}

export async function generatePdf(
  client,
  simulation,
  rangeDetails,
  consultant
) {
  try {
    const response = await useHttp.post(
      "/pdf/generate",
      { client, simulation, rangeDetails, consultant, action: "download" },
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const filename = simulation?.id
      ? `Proposta - ${simulation.plate}.pdf`
      : "Proposta.pdf";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
  }
}
