export async function listarCategorias() {
  const response = await fetch("http://localhost:8000/indicadores/admin/categorias", {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  const data = await response.json();
  return data.categorias || [];
}
