import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Autocomplete from '@/components/Autocomplete'
import { ListaCardProvider } from '@/contexts/ListaCardsContext'

describe('Autocomplete', () => {
  const nomeSelecionadoMock = jest.fn();

  const listaCards = [
    {
      id: "xy0-1",
      localId: "1",
      name: "Weedle",
      image: "https://assets.tcgdex.net/pt/xy/xy0/1"
    },
    {
      id: "xy9-1",
      localId: "1",
      name: "Chikorita",
      image: "https://assets.tcgdex.net/pt/xy/xy9/1"
    },
    {
      id: "xy8-1",
      localId: "1",
      name: "Paras",
      image: "https://assets.tcgdex.net/pt/xy/xy8/1"
    }
  ];

  const renderAutocomplete = () => {
    render(
      <ListaCardProvider lista={listaCards}>
        <Autocomplete onSelecionar={nomeSelecionadoMock} numero={2} />
      </ListaCardProvider>
    );
  }

  it('não mostra sugestões com menos de 3 caracteres', () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i);
      fireEvent.change(input, { target: { value: 'ch' } });

      expect(screen.queryByText('Chikorita')).not.toBeInTheDocument();
  });

  it('exibe sugestões ao digitar 3+ caracteres', async () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i);
      fireEvent.change(input, { target: { value: 'chi' } });

      expect(await screen.findByText('Chikorita')).toBeInTheDocument();
  });

  it('não exibe sugestões após não encontrar caracteres', async () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i);
      fireEvent.change(input, { target: { value: 'eev' } });

      expect(screen.queryByText('Eevee')).not.toBeInTheDocument();;
  });

  it('chama onSelecionar ao clicar em uma sugestão', async () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i);
      fireEvent.change(input, { target: { value: 'chi' } });

      const option = await screen.findByText('Chikorita');
      fireEvent.click(option);

      expect(nomeSelecionadoMock).toHaveBeenCalledWith('Chikorita');
  });

  it('fecha sugestões após clique fora (onBlur simulado)', async () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i);
      fireEvent.change(input, { target: { value: 'par' } });

      expect(await screen.findByText('Paras')).toBeInTheDocument();

      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.queryByText('Paras')).not.toBeInTheDocument();
      }, { timeout: 200 });
  });

  it('foca o input ao clicar no botão de busca', () => {
      renderAutocomplete();

      const input = screen.getByPlaceholderText(/Digite 3 ou mais/i) as HTMLInputElement;

      input.blur();

      const botaoBusca = screen.getByRole('button');
      fireEvent.click(botaoBusca);

      expect(document.activeElement).toBe(input);
  });
});
