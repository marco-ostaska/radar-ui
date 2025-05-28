export async function fetchRadarAcao(ticker) {
  const url = `http://localhost:8000/acoes/radar?ticker=${encodeURIComponent(ticker)}`;
  
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || errorData.message || "Erro ao buscar radar da ação");
  }

  const data = await res.json();
  return data;
}
