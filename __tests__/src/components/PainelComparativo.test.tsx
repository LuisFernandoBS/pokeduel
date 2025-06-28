import { render, screen, act } from '@testing-library/react';
import PainelComparativo from '@/components/PainelComparativo';

jest.mock('@/lib/tipoVantagem', () => ({
  compararTipos: jest.fn(() => 2),
}));

jest.mock('@/lib/comparaRaridade', () => ({
  compararRaridade: jest.fn(() => 2),
}));

jest.mock('@/hooks/useHistorico', () => ({
  useHistorico: () => ({
    adicionarHistorico: jest.fn(),
  }),
}));

describe('PainelComparativo', () => {
  const salvarCardVencedorMock = jest.fn();

  const card1Mock = {
    id: 'svp-043',
    image: 'https://assets.tcgdex.net/pt/sv/svp/043',
    name: 'Eevee',
    rarity: 'None',
    hp: 60,
    types: ['Incolor'],
    attacks: [
      { name: 'Chamar a Família' },
      { name: 'Investida', damage: 30 },
    ],
  };

  const card2Mock = {
    id: 'sv08.5-033',
    image: 'https://assets.tcgdex.net/pt/sv/sv08.5/033',
    name: 'Espeon',
    rarity: 'Rara',
    hp: 110,
    types: ['Psíquico'],
    attacks: [
      { name: 'Ataque Psíquico', damage: '30+' },
      { name: 'Raio Psíquico', damage: 60 },
    ],
  };

  beforeEach(() => {
    salvarCardVencedorMock.mockClear();
  });

  it('renderiza todos os elementos de comparação e chama salvarCardVencedor corretamente', async () => {
    await act(async () => {
      render(
        <PainelComparativo
          card1={card1Mock}
          card2={card2Mock}
          salvarCardVencedor={salvarCardVencedorMock}
        />
      );
    });

    expect(screen.getByTestId('comparacao-hp')).toBeInTheDocument();
    expect(screen.getByTestId('comparacao-ataque')).toBeInTheDocument();
    expect(screen.getByTestId('comparacao-tipo')).toBeInTheDocument();
    expect(screen.getByTestId('comparacao-raridade')).toBeInTheDocument();

    expect(screen.getAllByText('Espeon').length).toBeGreaterThan(0);
    expect(salvarCardVencedorMock).toHaveBeenCalledWith(2);
  });

  it('exibe empate quando atributos são iguais', async () => {
    const empateCard1 = { 
        ...card1Mock, 
        hp: 100 ,
        attacks: [
            { name: 'Ataque', damage: 80 },
        ],
    };
    const empateCard2 = { 
        ...card2Mock, 
        hp: 100 ,
        attacks: [
            { name: 'Ataque', damage: '80+' },
        ],
    };

    jest.mocked(require('@/lib/tipoVantagem').compararTipos).mockReturnValue(0);
    jest.mocked(require('@/lib/comparaRaridade').compararRaridade).mockReturnValue(0);

    await act(async () => {
      render(
        <PainelComparativo
          card1={empateCard1}
          card2={empateCard2}
          salvarCardVencedor={salvarCardVencedorMock}
        />
      );
    });

    expect(screen.getAllByText('Empate!').length).toBeGreaterThan(0);
  });

  it('exibe empate quando ataques dos cards são zero', async () => {
    const cardAtaqueZero1 = { 
        ...card1Mock, 
        attacks: [
            { name: 'AtaqueZero' },
        ],
    };
    const cardAtaqueZero2 = { 
        ...card2Mock, 
        attacks: [
            { name: 'AtaqueZero' },
        ],
    };

    await act(async () => {
      render(
        <PainelComparativo
          card1={cardAtaqueZero1}
          card2={cardAtaqueZero2}
          salvarCardVencedor={salvarCardVencedorMock}
        />
      );
    });

    const divAtaque = screen.getByTestId('comparacao-ataque');
    expect(divAtaque).toBeInTheDocument();
    expect(divAtaque).toHaveTextContent('Empate!');
  });

  it('exibe dados do card1 como ganhador', async () => {
    const vencedorCard1 = { 
        ...card1Mock, 
        hp: 100 ,
        attacks: [
            { name: 'Ataque', damage: '80+' },
        ],
    };
    const perdedorCard2 = { 
        ...card2Mock, 
        hp: 10 ,
        attacks: [
            { name: 'Ataque', damage: 20 },
        ],
    };

    jest.mocked(require('@/lib/tipoVantagem').compararTipos).mockReturnValue(1);
    jest.mocked(require('@/lib/comparaRaridade').compararRaridade).mockReturnValue(1);
    
    await act(async () => {
      render(
        <PainelComparativo
          card1={vencedorCard1}
          card2={perdedorCard2}
          salvarCardVencedor={salvarCardVencedorMock}
        />
      );
    });

    const divAtaque = screen.getByTestId('comparacao-ataque');
    expect(divAtaque).toBeInTheDocument();
    expect(divAtaque).toHaveTextContent('Eevee');

    const divHP = screen.getByTestId('comparacao-hp');
    expect(divHP).toBeInTheDocument();
    expect(divHP).toHaveTextContent('Eevee');

    const divTipo = screen.getByTestId('comparacao-tipo');
    expect(divTipo).toBeInTheDocument();
    expect(divTipo).toHaveTextContent('Eevee');

    const divRaridade = screen.getByTestId('comparacao-raridade');
    expect(divRaridade).toBeInTheDocument();
    expect(divRaridade).toHaveTextContent('Eevee');
  });
  
});
