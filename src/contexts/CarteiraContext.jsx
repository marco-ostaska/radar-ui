import { createContext, useState, useContext } from 'react';

const CarteiraContext = createContext();

export function CarteiraProvider({ children }) {
  const [carteiraId, setCarteiraId] = useState(1);
  const [carteiras, setCarteiras] = useState([
    { id: 1, nome: 'Carteira 1' },
    { id: 2, nome: 'Carteira 2' },
    { id: 3, nome: 'Carteira 3' }
  ]);

  const value = {
    carteiraId,
    setCarteiraId,
    carteiras,
    carteiraAtual: carteiras.find(c => c.id === carteiraId)
  };

  return (
    <CarteiraContext.Provider value={value}>
      {children}
    </CarteiraContext.Provider>
  );
}

export function useCarteira() {
  return useContext(CarteiraContext);
}
