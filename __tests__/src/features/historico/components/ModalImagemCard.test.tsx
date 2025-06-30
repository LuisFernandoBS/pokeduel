import { render, screen, fireEvent } from '@testing-library/react';
import ModalImagemCard from '@/features/historico/components/ModalImagemCard';

jest.mock('next/image', () => (props: any) => {
  const { src, alt, onLoad } = props;
  return (
    <img
      src={src}
      alt={alt}
      onLoad={onLoad}
      data-testid="imagem-card"
    />
  );
});

describe('ModalImagemCard', () => {
  const urlMock = 'https://meusite.com/card';
  const fecharImagemMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza modal e imagem de loading inicialmente', () => {
    render(<ModalImagemCard urlImagem={urlMock} fecharImagem={fecharImagemMock} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
    expect(screen.getByTestId('imagem-card')).toHaveAttribute('src', `${urlMock}/high.webp`);

    const loader = document.querySelector('.animate-pulse');
    expect(loader).toBeInTheDocument();
  });

  it('remove tela de loading ao carregar a imagem', () => {
    render(<ModalImagemCard urlImagem={urlMock} fecharImagem={fecharImagemMock} />);

    const imagem = screen.getByTestId('imagem-card');
    fireEvent.load(imagem);

    const loader = document.querySelector('.animate-pulse');
    expect(loader).not.toBeInTheDocument();
  });

  it('chama fecharImagem("") ao clicar no botão de fechar', () => {
    render(<ModalImagemCard urlImagem={urlMock} fecharImagem={fecharImagemMock} />);
    const btnFechar = screen.getByLabelText('Close');
    fireEvent.click(btnFechar);
    expect(fecharImagemMock).toHaveBeenCalledWith('');
  });
});
