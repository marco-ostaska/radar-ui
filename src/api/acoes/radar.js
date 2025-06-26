export async function fetchRadarAcao(ticker, force = false) {
  const url = `${(import.meta.env.VITE_SERVER_HOST || "http://localhost:8000")}/acoes/radar?ticker=${encodeURIComponent(
    ticker
  )}&force=${force}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.detail || errorData.message || "Erro ao buscar radar do FII"
    );
  }

  const data = await res.json();
  return data;
}
