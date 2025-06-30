import { render } from '@testing-library/react';
import GraficoRadar from '@/features/dashboard/components/GraficoRadar';
import '@testing-library/jest-dom';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

describe('Componente GraficoRadar', () => {
    it('não renderiza nada se os dados forem inválidos', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<GraficoRadar dados={[]} />);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Dados inválidos para o gráfico de barras.');
        consoleErrorSpy.mockRestore();
    });
});
