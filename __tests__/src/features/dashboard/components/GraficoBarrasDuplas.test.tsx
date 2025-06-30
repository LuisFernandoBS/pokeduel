import { render } from '@testing-library/react';
import GraficoBarrasDuplas from '@/features/dashboard/components/GraficoBarrasDuplas';

describe('GraficoBarrasDuplas', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });
    
    it('renderiza sem dados sem lançar erro', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<div style={{ width: 500, height: 300 }}><GraficoBarrasDuplas dados={[]} /></div>);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Dados inválidos para o gráfico de barras.');
        consoleErrorSpy.mockRestore();
    });
});
