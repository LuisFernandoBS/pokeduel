import { compararRaridade } from '@/lib/comparaRaridade';

describe('compararRaridade', () => {
    it('deve retornar 1 quando raridade1 for mais rara que raridade2', () => {
        expect(compararRaridade('Rara Holo VMAX', 'Rara Holo')).toBe(1);
        expect(compararRaridade('Hiper rara', 'Comum')).toBe(1);
        expect(compararRaridade('Rare Secreta', 'Rara Holo VSTAR')).toBe(1);
    });

    it('deve retornar 2 quando raridade2 for mais rara que raridade1', () => {
        expect(compararRaridade('Comum', 'Rara Holo VMAX')).toBe(2);
        expect(compararRaridade('Rara', 'Brilhante Ultra Rara')).toBe(2);
        expect(compararRaridade('None', 'Shiny rara')).toBe(2);
    });

    it('deve retornar 3 quando raridades forem iguais', () => {
        expect(compararRaridade('Comum', 'Comum')).toBe(3);
        expect(compararRaridade('Rara Holo VSTAR', 'Rara Holo VSTAR')).toBe(3);
        expect(compararRaridade('None', 'None')).toBe(3);
    });

    it('deve tratar raridades desconhecidas como "None"', () => {
        expect(compararRaridade('Inexistente', 'Comum')).toBe(2);
        expect(compararRaridade('Ultra Rara', 'Desconhecida')).toBe(1);
        expect(compararRaridade('Desconhecida1', 'Desconhecida2')).toBe(3);
    });
});
