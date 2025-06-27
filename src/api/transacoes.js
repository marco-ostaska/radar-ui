const API_URL = import.meta.env.VITE_SERVER_HOST || "http://localhost:8000";

// Listar transações
export const fetchTransacoesAcoes = async (carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/transacoes/acoes/listar?carteira_id=${carteiraId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar transações de ações:", error);
    throw error;
  }
};

export const fetchTransacoesFiis = async (carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/transacoes/fii/listar?carteira_id=${carteiraId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar transações de FIIs:", error);
    throw error;
  }
};

// Adicionar transação
export const adicionarTransacaoAcoes = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      quantidade: params.quantidade,
      preco: params.preco,
      tipo: params.tipo.toLowerCase(),
      carteira_id: params.carteiraId,
      data: params.data,
    });

    const response = await fetch(
      `${API_URL}/transacoes/acoes/adicionar?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao adicionar transação de ações:", error);
    throw error;
  }
};

export const adicionarTransacaoFiis = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      quantidade: params.quantidade,
      preco: params.preco,
      tipo: params.tipo.toLowerCase(),
      carteira_id: params.carteiraId,
      data: params.data,
    });

    const response = await fetch(
      `${API_URL}/transacoes/fii/adicionar?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao adicionar transação de FIIs:", error);
    throw error;
  }
};

// Atualizar transação
export const atualizarTransacaoAcoes = async (id, params) => {
  try {
    const queryParams = new URLSearchParams({
      carteira_id: params.carteiraId,
      ticker: params.ticker,
      quantidade: params.quantidade,
      preco: params.preco,
      tipo: params.tipo.toLowerCase(),
      data: params.data,
    });

    const response = await fetch(
      `${API_URL}/transacoes/acoes/atualizar/${id}?${queryParams}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar transação de ações:", error);
    throw error;
  }
};

export const atualizarTransacaoFiis = async (id, params) => {
  try {
    const queryParams = new URLSearchParams({
      carteira_id: params.carteiraId,
      ticker: params.ticker,
      quantidade: params.quantidade,
      preco: params.preco,
      tipo: params.tipo.toLowerCase(),
      data: params.data,
    });

    const response = await fetch(
      `${API_URL}/transacoes/fii/atualizar/${id}?${queryParams}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar transação de FIIs:", error);
    throw error;
  }
};

// Deletar transação
export const deletarTransacaoAcoes = async (id, carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/transacoes/acoes/deletar/${id}?carteira_id=${carteiraId}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao deletar transação de ações:", error);
    throw error;
  }
};

export const deletarTransacaoFiis = async (id, carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/transacoes/fii/deletar/${id}?carteira_id=${carteiraId}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao deletar transação de FIIs:", error);
    throw error;
  }
};

// Agrupamento e Desdobramento para FIIs e Ações

export const agrupamentoFii = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      data_agrupamento: params.data_agrupamento,
      proporcao_antes: params.proporcao_antes,
      proporcao_depois: params.proporcao_depois,
      carteira_id: params.carteira_id,
    });

    const response = await fetch(
      `${API_URL}/transacoes/fii/agrupamento?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar agrupamento de FII:", error);
    throw error;
  }
};

export const agrupamentoAcoes = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      data_agrupamento: params.data_agrupamento,
      proporcao_antes: params.proporcao_antes,
      proporcao_depois: params.proporcao_depois,
      carteira_id: params.carteira_id,
    });

    const response = await fetch(
      `${API_URL}/transacoes/acoes/agrupamento?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar agrupamento de ações:", error);
    throw error;
  }
};

export const desdobramentoAcoes = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      data_desdobramento: params.data_desdobramento,
      proporcao_antes: params.proporcao_antes,
      proporcao_depois: params.proporcao_depois,
      carteira_id: params.carteira_id,
    });

    const response = await fetch(
      `${API_URL}/transacoes/acoes/desdobramento?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar desdobramento de ações:", error);
    throw error;
  }
};

export const desdobramentoFii = async (params) => {
  try {
    const queryParams = new URLSearchParams({
      ticker: params.ticker,
      data_desdobramento: params.data_desdobramento,
      proporcao_antes: params.proporcao_antes,
      proporcao_depois: params.proporcao_depois,
      carteira_id: params.carteira_id,
    });

    const response = await fetch(
      `${API_URL}/transacoes/fii/desdobramento?${queryParams}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao registrar desdobramento de FII:", error);
    throw error;
  }
};
