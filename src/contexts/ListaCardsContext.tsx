import React, { createContext, useContext } from 'react';

export interface ListaCard {
  id: string;
  name: string;
  localId: string;
  image?: string;
}

const ListaCardsContext = createContext<ListaCard[] | undefined>(undefined);

export const useListaCard = () => {
  const contexto = useContext(ListaCardsContext);
  if (!contexto) {
    throw new Error("useListaCard deve ser usado dentro de <ListaCardProvider>");
  }
  return contexto;
};

interface ListaCardProviderProps {
  children: React.ReactNode;
  lista: ListaCard[];
}

export const ListaCardProvider: React.FC<ListaCardProviderProps> = ({ children, lista }) => {
  return (
    <ListaCardsContext.Provider value={lista}>
      {children}
    </ListaCardsContext.Provider>
  );
};
