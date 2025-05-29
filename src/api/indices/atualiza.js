// src/api/indices/atualiza.js

export async function fetchIndices(force = false) {
  const res = await fetch(
    `http://localhost:8000/indices/atualiza?force=${force}`
  );
  if (!res.ok) throw new Error("Erro ao buscar índices");
  const data = await res.json();
  return {
    Selic: `${data.selic_atual ?? data.selic}%`,
    "Selic 5 Anos": `${data.selic ?? "N/A"}%`,
    IPCA: `${data.ipca_atual ?? data.ipca}%`,
    "IPCA 5 Anos": `${data.ipca_media5 ?? "N/A"}%`,
    "Juros Reais": `${data.selic_atual - (data.ipca_atual ?? data.ipca)}%`,
    "Spread Indices":
      Math.max(Number(data.selic ?? 0), Number(data.ipca_media5 ?? 0)) + "%",
  };
}

