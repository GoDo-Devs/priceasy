import useHttp from "@/services/useHttp";

export async function generatePdf(
  client,
  simulation,
  rangeDetails,
  consultant
) {
  try {
    const response = await useHttp.post(
      "/pdf/generate",
      { client, simulation, rangeDetails, consultant },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const filename = simulation?.id
      ? `proposta_${simulation.id}.pdf`
      : "proposta.pdf";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Erro ao gerar PDF");
  }
}
