import { compararTipos } from '@/lib/tipoVantagem';

describe('compararTipos', () => {
    it('deve retornar 1 quando tipo1 tem vantagem sobre tipo2', () => {
        expect(compararTipos('Fogo', 'Grama')).toBe(1);
        expect(compararTipos('Água', 'Fogo')).toBe(1);
        expect(compararTipos('Elétrico', 'Água')).toBe(1);
    });

    it('deve retornar 2 quando tipo2 tem vantagem sobre tipo1', () => {
        expect(compararTipos('Grama', 'Fogo')).toBe(2);
        expect(compararTipos('Fogo', 'Água')).toBe(2);
        expect(compararTipos('Água', 'Elétrico')).toBe(2);
    });

    it('deve retornar 3 quando não houver vantagem entre os tipos', () => {
        expect(compararTipos('Normal', 'Fogo')).toBe(3);
        expect(compararTipos('Fogo', 'Fogo')).toBe(3);
        expect(compararTipos('Grama', 'Elétrico')).toBe(3);
    });

    it('deve retornar 3 quando ambos tiverem vantagem um sobre o outro (empate)', () => {
        expect(compararTipos('Fogo', 'Fogo')).toBe(3);
    });
});
