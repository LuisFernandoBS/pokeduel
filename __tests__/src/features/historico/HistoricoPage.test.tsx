import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoricoPage from '@/app/historico/page';
import * as useHistoricoHook from '@/hooks/useHistorico';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@/hooks/useHistorico', () => ({
    useHistorico: jest.fn()
}));

describe('HistoricoPage', () => {
    const mockHistorico = [
        {
            card1: {
                nome: 'Pikachu',
                img: '/pikachu',
                hp: 60,
                ataque: 50,
                tipo: 'Elétrico',
                iconeTipo: '⚡',
                raridade: 'Comum'
            },
            card2: {
                nome: 'Charmander',
                img: '/charmander',
                hp: 50,
                ataque: 55,
                tipo: 'Fogo',
                iconeTipo: '🔥',
                raridade: 'Incomum'
            },
            comparativo: {
                cardVencedor: 1
            }
        },
        {
            card1: {
                nome: 'Bulbasaur',
                img: '/bulbasaur',
                hp: 65,
                ataque: 45,
                tipo: 'Grama',
                iconeTipo: '🍃',
                raridade: 'Comum',
            },
            card2: {
                nome: 'Squirtle',
                img: '/squirtle',
                hp: 60,
                ataque: 48,
                tipo: 'Água',
                iconeTipo: '💧',
                raridade: 'Rara',
            },
                comparativo: {
                cardVencedor: 2,
            },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título e o campo de busca', () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: [] });

        render(<HistoricoPage />);

        expect(screen.getByText('Histórico de Duelo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Digite nome da carta para iniciar a busca')).toBeInTheDocument();
    });

    it('deve exibir a mensagem "Nenhum duelo encontrado."', () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: [] });

        render(<HistoricoPage />);

        expect(screen.getByText('Nenhum duelo encontrado.')).toBeInTheDocument();
    });

    it('deve exibir duelos quando o histórico está preenchido', async () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        await waitFor(() => {
        expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
        expect(screen.getByText(/Charmander/)).toBeInTheDocument();
        });
    });

    it('deve filtrar duelos com base no texto digitado', async () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        const input = screen.getByPlaceholderText('Digite nome da carta para iniciar a busca');
        fireEvent.change(input, { target: { value: 'Pik' } });

        await waitFor(() => {
        expect(screen.getByText(/Pikachu/)).toBeInTheDocument();
        expect(screen.queryByText(/Charmander/)).toBeInTheDocument();
        });
    });

    it('deve limpar o filtro e mostrar todos os duelos', async () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        const input = screen.getByPlaceholderText('Digite nome da carta para iniciar a busca');
        fireEvent.change(input, { target: { value: 'Pik' } });

        await waitFor(() => {
        expect(screen.queryByText(/Pikachu/)).toBeInTheDocument();
        expect(screen.queryByText(/Charmander/)).toBeInTheDocument();
        expect(screen.queryByText(/Bulbasaur/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Squirtle/)).not.toBeInTheDocument();
        });

        fireEvent.change(input, { target: { value: '' } });

        await waitFor(() => {
        expect(screen.queryByText(/Pikachu/)).toBeInTheDocument();
        expect(screen.queryByText(/Charmander/)).toBeInTheDocument();
        expect(screen.queryByText(/Bulbasaur/)).toBeInTheDocument();
        expect(screen.queryByText(/Squirtle/)).toBeInTheDocument();
        });
    });

    it('deve abrir imagem Card 1 do duelo', async () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        const input = screen.getByPlaceholderText('Digite nome da carta para iniciar a busca');
        fireEvent.change(input, { target: { value: 'Pik' } });

        await waitFor(() => {
            expect(screen.queryByText(/Pikachu/)).toBeInTheDocument();
            expect(screen.queryByText(/Charmander/)).toBeInTheDocument();

            const imagens = screen.getAllByAltText('card1');
            fireEvent.click(imagens[0]);
        
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

    });

    it('deve abrir imagem Card 2 do duelo', async () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        const input = screen.getByPlaceholderText('Digite nome da carta para iniciar a busca');
        fireEvent.change(input, { target: { value: 'Pik' } });

        await waitFor(() => {
            expect(screen.queryByText(/Pikachu/)).toBeInTheDocument();
            expect(screen.queryByText(/Charmander/)).toBeInTheDocument();

            const imagens = screen.getAllByAltText('card2');
            fireEvent.click(imagens[0]);
        
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

     it('foca o input ao clicar no botão de busca', () => {
        (useHistoricoHook.useHistorico as jest.Mock).mockReturnValue({ historico: mockHistorico });

        render(<HistoricoPage />);

        const input = screen.getByPlaceholderText(/Digite nome da carta/i) as HTMLInputElement;

        input.blur();

        const botaoBusca = screen.getByTestId('btn-filtro');
        fireEvent.click(botaoBusca);

        expect(document.activeElement).toBe(input);
  });
});
