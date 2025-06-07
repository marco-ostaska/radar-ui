const API_URL = "http://localhost:8000";

export const fetchCarteira = async (carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/carteira/acoes?carteira_id=${carteiraId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar carteira:", error);
    throw error;
  }
};

export const fetchCarteiraFiis = async (carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/carteira/fii?carteira_id=${carteiraId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar carteira de FIIs:", error);
    throw error;
  }
};

export const fetchCarteiraResumo = async (carteiraId = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/carteira/resumo?carteira_id=${carteiraId}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar resumo da carteira:", error);
    throw error;
  }
};
