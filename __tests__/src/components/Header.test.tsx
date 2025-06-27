import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));


describe('Header', () => {

    beforeEach(() => {
        pushMock.mockClear();
    });

    it('Confere se os botões estão sendo exibidos', () => {
        render(<Header page='dashboard' />)
        expect(screen.getByText('Duelo')).toBeInTheDocument()
        expect(screen.getByText('Histórico')).toBeInTheDocument()
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('Deve chamar router.push("/") ao clicar no botão Duelo', () => {
        render(<Header page="dashboard" />);
        const botaoDuelo = screen.getByText('Duelo');
        fireEvent.click(botaoDuelo);
        expect(pushMock).toHaveBeenCalledWith('/');
    });

    it('Deve chamar router.push("/historico") ao clicar no botão Histórico', () => {
        render(<Header page="dashboard" />);
        const botaoHistorico = screen.getByText('Histórico');
        fireEvent.click(botaoHistorico);
        expect(pushMock).toHaveBeenCalledWith('/historico');
    });

    it('Deve chamar router.push("/dashboard") ao clicar no botão Dashboard', () => {
        render(<Header page="duelo" />);
        const botaoDashboard = screen.getByText('Dashboard');
        fireEvent.click(botaoDashboard);
        expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });

})