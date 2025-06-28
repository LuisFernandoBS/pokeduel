import { render, screen, fireEvent, act } from '@testing-library/react';
import CarrosselCards from '@/components/CarrosselCards';

const mockCards = [
    {
        "id": "svp-043",
        "image": "https://assets.tcgdex.net/pt/sv/svp/043",
        "name": "Eevee",
    },
    {
        "id": "sv06.5-050",
        "image": "https://assets.tcgdex.net/pt/sv/sv06.5/050",
        "name": "Eevee",
    },
    {
        "id": "xy3-80",
        "image": "https://assets.tcgdex.net/pt/xy/xy3/80",
        "name": "Eevee",
    },
    {
        "id": "bw9-90",
        "image": "https://assets.tcgdex.net/pt/bw/bw9/90",
        "name": "Eevee",
    },
    {
        "id": "swsh4-130",
        "image": "https://assets.tcgdex.net/pt/swsh/swsh4/130",
        "name": "Eevee",
    },
]

const cardSelecionadoMock = jest.fn()

beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    window.dispatchEvent(new Event('resize'))
})

describe('CarrosselCards', () => {

    const renderCarrosselCards = async () => {
        await act(async () => {
            render(<CarrosselCards listaDisplay={mockCards} carregandoLista={false} cardSelecionado={cardSelecionadoMock} />)
        })
    }
    
    it('renderiza imagem de carregamento quando carregandoLista é true', async () => {
        await act(async () => {
            render(<CarrosselCards listaDisplay={mockCards} carregandoLista={true} cardSelecionado={cardSelecionadoMock} />)
        })

        expect(screen.getByAltText(/Carregando/i)).toBeInTheDocument()
    })

    it('renderiza os cards quando carregandoLista é false', async () => {
        await renderCarrosselCards()
        const imagens = screen.getAllByAltText('card')
        expect(imagens.length).toBe(mockCards.length)
    })

    it('navega entre os slides ao clicar nos botões', async () => {
        await renderCarrosselCards()
        const btnProximo = screen.getByText('▶')
        const btnAnterior = screen.getByText('◀')

        expect(btnAnterior).toBeDisabled()
        fireEvent.click(btnProximo)
        expect(btnAnterior).not.toBeDisabled()
    })

    it('dispara callback ao clicar em um card carregado', async () => {
        await renderCarrosselCards()

        act(() => {
            const imagens = document.querySelectorAll('img')
            imagens.forEach(img => img.dispatchEvent(new Event('load')))
        })

        const imgs = document.querySelectorAll('img')
        fireEvent.click(imgs[0])

        expect(cardSelecionadoMock).toHaveBeenCalled()
    })

    it('não permite avançar além do último slide', async () => {
        await renderCarrosselCards()

        const btnProximo = screen.getByText('▶')

        fireEvent.click(btnProximo)
        fireEvent.click(btnProximo)
        fireEvent.click(btnProximo)
        
        expect(btnProximo).toBeDisabled()
    })
    
    it('não permite voltar além do primeiro slide', async () => {
        await renderCarrosselCards()
        
        const btnAnterior = screen.getByText('◀')
        
        expect(btnAnterior).toBeDisabled()
    })
    
    it('voltando para o primeiro slide', async () => {
        await renderCarrosselCards()
        
        const btnProximo = screen.getByText('▶')
        const btnAnterior = screen.getByText('◀')
        
        fireEvent.click(btnProximo)
        
        expect(btnAnterior).toBeEnabled()
        
        fireEvent.click(btnAnterior)

        expect(btnAnterior).toBeDisabled()
    })

    it('responsividade para mobile', async () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 360 })
        window.dispatchEvent(new Event('resize'))

        await renderCarrosselCards()
        
        const btnProximo = screen.getByText('▶')
        
        fireEvent.click(btnProximo)
        fireEvent.click(btnProximo)
        fireEvent.click(btnProximo)

        expect(btnProximo).toBeEnabled();

        fireEvent.click(btnProximo)
        fireEvent.click(btnProximo)

        expect(btnProximo).toBeDisabled();
    })
})
