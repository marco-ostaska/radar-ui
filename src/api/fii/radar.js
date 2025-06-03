//src/api/fii/radar.js

export async function fetchRadaFii(ticker) {
  const url = `http://localhost:8000/fii/radar?ticker=${encodeURIComponent(
    ticker
  )}`;

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
