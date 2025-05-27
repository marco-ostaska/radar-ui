export async function adicionarAtivo(tipo, ticker) {
  const url = `http://localhost:8000/indicadores/admin/adicionar?tipo=${encodeURIComponent(tipo)}&ticker=${encodeURIComponent(ticker)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: "",
  });

  if (!res.ok) {
    const errorData = await res.json();
    // Pode ter detail ou message, dê preferência para detail
    throw new Error(errorData.detail || errorData.message || "Erro ao adicionar ativo");
  }

  const data = await res.json();
  return data;
}
