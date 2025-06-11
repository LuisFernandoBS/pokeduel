'use client'
import React, { createContext, useContext } from 'react';

export interface HistoricoCard {
  idCard1: string;
  idCard2: string;
}

const HistoricoContext = createContext<HistoricoCard[] | undefined>(undefined);

export const useHistoricoCard = () => {
  const contexto = useContext(HistoricoContext);
  if (!contexto) {
    throw new Error("useHistoricoCard deve ser usado dentro de <HistoricoDuelContext>");
  }
  return contexto;
};

interface HistoricoDuelContextProps {
  children: React.ReactNode;
  lista: HistoricoCard[];
}

export const HistoricoDuelContext: React.FC<HistoricoDuelContextProps> = ({ children, lista }) => {
  return (
    <HistoricoContext.Provider value={lista}>
      {children}
    </HistoricoContext.Provider>
  );
};
