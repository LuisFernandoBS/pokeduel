const mockGet = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
  })),
}));

import { getAllCards, getCardById } from '@/services/tcgdexService';

describe('tcgdexService', () => {
    beforeEach(() => {
        mockGet.mockReset();
    });

    it('deve buscar todos os cards', async () => {
        const mockData = { cards: [{ id: '1', name: 'Pikachu' }] };
        mockGet.mockResolvedValueOnce({ data: mockData });

        const data = await getAllCards();

        expect(mockGet).toHaveBeenCalledWith('/cards');
        expect(data).toEqual(mockData);
    });

    it('deve buscar card por id', async () => {
        const mockData = { id: '1', name: 'Pikachu' };
        mockGet.mockResolvedValueOnce({ data: mockData });

        const data = await getCardById('1');

        expect(mockGet).toHaveBeenCalledWith('/cards/1');
        expect(data).toEqual(mockData);
    });
});