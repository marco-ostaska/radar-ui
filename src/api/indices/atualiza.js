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
  };
}

export async function fetchMelhorIndice() {
  const res = await fetch("http://localhost:8000/indices/melhor");
  if (!res.ok) throw new Error("Erro ao buscar melhor índice");
  const data = await res.json();
  return data["melhor índice"];
}
