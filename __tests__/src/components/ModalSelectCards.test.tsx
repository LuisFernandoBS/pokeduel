import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModalSelectCards from '@/components/ModalSelectCards';
import { useListaCard } from '@/contexts/ListaCardsContext';
import * as service from '@/services/tcgdexService';

jest.mock('@/contexts/ListaCardsContext', () => ({
  useListaCard: jest.fn(),
}));

jest.mock('@/components/Autocomplete', () => ({ onSelecionar }: any) => (
  <input
    data-testid="autocomplete"
    onChange={(e) => onSelecionar(e.target.value)}
    placeholder="Buscar card"
  />
));

jest.mock('@/components/CarrosselCards', () => ({ listaDisplay, cardSelecionado }: any) => (
  <div data-testid="carrossel">
    {listaDisplay.map((card: any) => (
      <div key={card.id} onClick={() => cardSelecionado(card)}>
        {card.name}
      </div>
    ))}
  </div>
));

describe('ModalSelectCards', () => {
  const mockLista = [
    { id: '1', name: 'Pikachu' },
    { id: '2', name: 'Charizard' },
  ];

  const mockCardCompleto = { id: '1', name: 'Pikachu', image: 'url' };

  const carregarCardMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useListaCard as jest.Mock).mockReturnValue(mockLista);
    jest.spyOn(service, 'getCardById').mockResolvedValue(mockCardCompleto);
  });

  it('renderiza modal e mostra instrução inicial', () => {
    render(<ModalSelectCards carregarCard={carregarCardMock} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Buscar cards')).toBeInTheDocument();
    expect(screen.getByText(/Digite o nome para começar a busca/)).toBeInTheDocument();
  });

  it('chama carregarCard(null) ao clicar em cancelar', () => {
    render(<ModalSelectCards carregarCard={carregarCardMock} />);
    const btnCancel = screen.getByText('Cancel');
    fireEvent.click(btnCancel);
    expect(carregarCardMock).toHaveBeenCalledWith(null);
  });

  it('chama carregarCard(null) ao clicar no botão de fechar (X)', () => {
    render(<ModalSelectCards carregarCard={carregarCardMock} />);
    const btnClose = screen.getByLabelText('Close');
    fireEvent.click(btnClose);
    expect(carregarCardMock).toHaveBeenCalledWith(null);
  });

  it('realiza busca e renderiza carrossel com card', async () => {
    render(<ModalSelectCards carregarCard={carregarCardMock} />);

    const input = screen.getByTestId('autocomplete');
    fireEvent.change(input, { target: { value: 'Pikachu' } });

    await waitFor(() => {
      expect(screen.getByTestId('carrossel')).toBeInTheDocument();
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
  });

  it('habilita botão Confirmar após selecionar card e o envia ao clicar', async () => {
    render(<ModalSelectCards carregarCard={carregarCardMock} />);

    const input = screen.getByTestId('autocomplete');
    fireEvent.change(input, { target: { value: 'Pikachu' } });

    await waitFor(() => screen.getByText('Pikachu'));

    fireEvent.click(screen.getByText('Pikachu'));

    const btnConfirmar = screen.getByText('Confirmar');
    expect(btnConfirmar).not.toBeDisabled();

    fireEvent.click(btnConfirmar);
    expect(carregarCardMock).toHaveBeenCalledWith(mockCardCompleto);
  });
});
