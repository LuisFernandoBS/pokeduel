import { render, screen } from '@testing-library/react';
import TooltipCustom from '@/features/dashboard/components/TooltipCustom';


describe('TooltipCustom', () => {
    it('não renderiza nada se não estiver ativo ou payload estiver vazio', () => {
        const { container } = render(<TooltipCustom active={false} payload={[]} label={''} />)
        expect(container.firstChild).toBeNull()
    })

    it('renderiza tipoTooltip 0 (label e apenas um payload)', () => {
        render(
        <TooltipCustom
            active={true}
            label="Carta A"
            payload={[{ name: 'HP', value: 50 }]}
        />
        )
        expect(screen.getByText('Carta A')).toBeInTheDocument()
        expect(screen.getByText('HP: 50')).toBeInTheDocument()
    })

    it('renderiza tipoTooltip 1 (label e múltiplos payloads)', () => {
        render(
        <TooltipCustom
            active={true}
            label="Carta B"
            payload={[
            { name: 'HP', value: 60 },
            { name: 'Ataque', value: 40 },
            ]}
        />
        )
        expect(screen.getByText('Carta B')).toBeInTheDocument()
        expect(screen.getByText('HP: 60')).toBeInTheDocument()
        expect(screen.getByText('Ataque: 40')).toBeInTheDocument()
    })

    it('renderiza tipoTooltip 2 (sem label e múltiplos payloads)', () => {
        render(
        <TooltipCustom
            active={true}
            label={null}
            payload={[
            { name: 'HP', value: 70 },
            { name: 'Defesa', value: 20 },
            ]}
        />
        )
        expect(screen.getByText('HP: 70')).toBeInTheDocument()
        expect(screen.getByText('Defesa: 20')).toBeInTheDocument()
    })

    it('renderiza tipoTooltip 3 (sem label e apenas um payload)', () => {
        render(
        <TooltipCustom
            active={true}
            label={null}
            payload={[{ name: 'Ataque', value: 90 }]}
        />
        )
        expect(screen.getByText('Ataque: 90')).toBeInTheDocument()
    })
})
