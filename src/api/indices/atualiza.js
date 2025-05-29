// src/api/indices/atualiza.js

export async function fetchIndices(force = false) {
  const res = await fetch(
    `http://localhost:8000/indices/atualiza?force=${force}`
  );
  if (!res.ok) throw new Error("Erro ao buscar índices");
  const data = await res.json();
  
  return {
    selic_atual: data.selic_atual ?? data.selic,
    selic_5anos: data.selic ?? null,
    ipca_atual: data.ipca_atual ?? data.ipca,
    ipca_5anos: data.ipca_media5 ?? null,
    juros_reais:
      (data.selic_atual ?? data.selic) - (data.ipca_atual ?? data.ipca),
    spread_indices: Math.max(
      Number(data.selic ?? 0),
      Number(data.ipca_media5 ?? 0)
    ),
  };
}
