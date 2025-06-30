import { render } from '@testing-library/react'
import GraficoPie from '@/features/dashboard/components/GraficoPie';


describe('GraficoPie', () => {
    beforeEach(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    })

    it('exibe erro no console se os dados estiverem vazios', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        render(<GraficoPie dados={[]} />)

        expect(consoleErrorSpy).toHaveBeenCalledWith('Dados inválidos para o gráfico de barras.')
        consoleErrorSpy.mockRestore()
    })
})
