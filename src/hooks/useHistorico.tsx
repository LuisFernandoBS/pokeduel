'use client';

import { useState, useEffect } from 'react';

export interface InfoCard {
  id: string;
  nome: string;
  hp: string;
  tipo: string;
  iconeTipo: string;
  img: string;
  raridade: string;
  ataque: number;
}

export interface resultadoComparativo {
  nome: string;
  cor: string;
}

export interface ComparativoCard {  
  hp: resultadoComparativo;
  tipo: resultadoComparativo;
  raridade: resultadoComparativo;
  ataque: resultadoComparativo;
  cardVencedor: number;
}

export interface HistoricoCard {
  card1: InfoCard;
  card2: InfoCard;
  comparativo: ComparativoCard;
}

export function useHistorico() {
  const [historico, setHistorico] = useState<HistoricoCard[]>([]);

  useEffect(() => {
    const armazenado = localStorage.getItem('poke_duelo_historico');
    if (armazenado && JSON.parse(armazenado).length > 0) {
      setHistorico(JSON.parse(armazenado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poke_duelo_historico', JSON.stringify(historico));
  }, [historico]);

  const adicionarHistorico = (novo: HistoricoCard) => {
    setHistorico((prev) => [...prev, novo]);
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('poke_duelo_historico');
  };

  return { historico, adicionarHistorico, limparHistorico };
}