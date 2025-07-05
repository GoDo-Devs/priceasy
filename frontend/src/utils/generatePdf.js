import useHttp from "@/services/useHttp";

export async function generatePdf(client, simulation, rangeDetails) {
  try {
    const response = await useHttp.post(
      "/pdf/generate",
      { client, simulation, rangeDetails },
      { responseType: "blob" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `simulacao_${client.cpf || "cliente"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("Erro ao gerar PDF");
  }
}
