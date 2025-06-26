const vantagensDeTipo: Record<string, string[]> = {
  Fogo: ['Grama', 'Inseto', 'Gelo', 'Metal'],
  Água: ['Fogo', 'Rocha', 'Terra'],
  Grama: ['Água', 'Rocha', 'Terra'],
  Elétrico: ['Água', 'Voador'],
  Psíquico: ['Lutador', 'Venenoso'],
  Lutador: ['Normal', 'Gelo', 'Rocha', 'Sombrio', 'Metal'],
  Rocha: ['Fogo', 'Voador', 'Inseto', 'Gelo'],
  Terra: ['Elétrico', 'Fogo', 'Venenoso', 'Rocha', 'Metal'],
  Gelo: ['Grama', 'Terra', 'Voador', 'Dragão'],
  Inseto: ['Grama', 'Psíquico', 'Sombrio'],
  Sombrio: ['Psíquico', 'Fantasma'],
  Fantasma: ['Psíquico', 'Fantasma'],
  Metal: ['Gelo', 'Rocha', 'Fada'],
  Fada: ['Lutador', 'Dragão', 'Sombrio'],
  Dragão: ['Dragão'],
  Normal: [],
  Voador: ['Grama', 'Inseto', 'Lutador'],
  Venenoso: ['Grama', 'Fada'],
};

export function compararTipos(tipo1: string, tipo2: string): number {
  const vantagem1 = vantagensDeTipo[tipo1]?.includes(tipo2) || false;
  const vantagem2 = vantagensDeTipo[tipo2]?.includes(tipo1) || false;

  if (vantagem1 && !vantagem2) return 1;
  if (!vantagem1 && vantagem2) return 2;
  return 3;
}