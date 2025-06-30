import { renderHook, act } from '@testing-library/react';
import { useHistorico, HistoricoCard } from '@/hooks/useHistorico';

describe('useHistorico', () => {
    const mockLocalStorage: { [key: string]: string } = {};

    beforeEach(() => {
        Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => mockLocalStorage[key] || null);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
        mockLocalStorage[key] = value;
        });
        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
        delete mockLocalStorage[key];
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockCard: HistoricoCard = {
        card1: {
            id: '001',
            nome: 'Pikachu',
            hp: '60',
            tipo: 'Elétrico',
            iconeTipo: '⚡',
            img: 'pikachu.png',
            raridade: 'Comum',
            ataque: 55,
        },
        card2: {
            id: '002',
            nome: 'Charmander',
            hp: '50',
            tipo: 'Fogo',
            iconeTipo: '🔥',
            img: 'charmander.png',
            raridade: 'Raro',
            ataque: 52,
        },
        comparativo: {
            hp: { nome: 'Pikachu', cor: 'verde' },
            tipo: { nome: 'Charmander', cor: 'vermelho' },
            raridade: { nome: 'Charmander', cor: 'vermelho' },
            ataque: { nome: 'Pikachu', cor: 'verde' },
            cardVencedor: 1,
        },
    };

    it('deve iniciar com histórico vazio se localStorage não tiver nada', () => {
        const { result } = renderHook(() => useHistorico());
        expect(result.current.historico).toEqual([]);
    });

    it('deve adicionar um item ao histórico', () => {
        const { result } = renderHook(() => useHistorico());

        act(() => {
            result.current.adicionarHistorico(mockCard);
        });

        expect(result.current.historico).toHaveLength(1);
        expect(result.current.historico[0]).toEqual(mockCard);
        expect(JSON.parse(mockLocalStorage['poke_duelo_historico'])).toHaveLength(1);
    });

    it('deve limpar o histórico', () => {
        const { result } = renderHook(() => useHistorico());

        act(() => {
            result.current.adicionarHistorico(mockCard);
        });

        act(() => {
            result.current.limparHistorico();
        });

        expect(result.current.historico).toEqual([]);
        expect(mockLocalStorage['poke_duelo_historico']).toBe(JSON.stringify([]));
    });

    it('deve carregar histórico salvo no localStorage ao iniciar', () => {
        mockLocalStorage['poke_duelo_historico'] = JSON.stringify([mockCard]);

        const { result } = renderHook(() => useHistorico());

        expect(result.current.historico).toHaveLength(1);
        expect(result.current.historico[0].card1.nome).toBe('Pikachu');
    });
});
