import { render } from '@testing-library/react'
import GraficoBarrasSimples from '@/features/dashboard/components/GraficoBarrasSimples';


describe('GraficoBarrasSimples', () => {
    beforeEach(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    })

    it('exibe erro no console se os dados estiverem vazios', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        render(<GraficoBarrasSimples dados={[]} />)

        expect(consoleErrorSpy).toHaveBeenCalledWith('Dados inválidos para o gráfico de barras.')
        consoleErrorSpy.mockRestore()
    })
})
