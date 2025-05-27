// src/api/adm/listarAtivosPorCategoria.js

export async function listarAtivosPorCategoria(categoria) {
  const response = await fetch(
    `http://localhost:8000/indicadores/admin/listar?tipo=${categoria}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar ativos da categoria ${categoria}`);
  }

  const data = await response.json();
  // Retorna o array de tickers
  return data.tickers || [];
}
