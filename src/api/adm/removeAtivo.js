export async function removerAtivo(tipo, ticker) {
  const url = `${(import.meta.env.VITE_SERVER_HOST || "http://localhost:8000")}/indicadores/admin/remover?tipo=${encodeURIComponent(tipo)}&ticker=${encodeURIComponent(ticker)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
    body: "", // geralmente DELETE não precisa de body, mas se API pedir, mantenha
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || errorData.message || "Erro ao remover ativo");
  }

  const data = await res.json();
  return data;
}
