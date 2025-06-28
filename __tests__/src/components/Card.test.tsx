import { render, screen, act } from '@testing-library/react';
 import '@testing-library/jest-dom';
import Card from '@/components/Card';

describe('Card', () => {

    const cardMock = {
        id: 'svp-043',
        image: 'https://assets.tcgdex.net/pt/sv/svp/043',
        name: 'Eevee',
        rarity: 'None',
        hp: 60,
        types: ['Incolor'],
    };

    it('renderiza todos os elementos do card', () => {
        render(
            <Card card={cardMock} numCard={2} cardVencedor={2}/>
        );

        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();

        expect(screen.queryByText(/Eevee/)).toBeInTheDocument();
        expect(screen.queryByText('HP: 60')).toBeInTheDocument();
        expect(screen.queryByText('Incolor')).toBeInTheDocument();
        expect(screen.queryByText('None')).toBeInTheDocument();
    });

    it('card sem imagem e atributos', () => {
        const cardSemImgMock = {
            id: 'svp-043',
            image:'',
            name:'',
            hp:'',
            rarity:'',
            types:[],
        }

        render(
            <Card card={cardSemImgMock} numCard={2} cardVencedor={2}/>
        );

        const img = screen.queryByRole('img');
        expect(img).not.toBeInTheDocument();

        const placeholder = document.querySelector('.animate-pulse');
        expect(placeholder).toBeInTheDocument();

        expect(screen.getByText(/Nome da carta/)).toBeInTheDocument();
        expect(screen.getByText('HP: HP da carta')).toBeInTheDocument();
        expect(screen.getByText('Tipo da carta')).toBeInTheDocument();
        expect(screen.getByText('Raridade da carta')).toBeInTheDocument();
    });

    it('exibe o destaque de vencedor quando o card é o vencedor', () => {
        render(<Card card={cardMock} numCard={2} cardVencedor={2} />);

        expect(screen.getByText(/Eevee - 👑 Vencedor 👑/)).toBeInTheDocument();

        const titulo = screen.getByText(/Eevee/);
        expect(titulo).toHaveClass('text-yellow-500');
    });

    it('não exibe destaque de vencedor quando o card não for o vencedor', () => {
        render(<Card card={cardMock} numCard={1} cardVencedor={2} />);

        expect(screen.getByText(/^Eevee$/)).toBeInTheDocument();
        expect(screen.queryByText(/Vencedor/)).not.toBeInTheDocument();

        const titulo = screen.getByText(/^Eevee$/);
        expect(titulo).toHaveClass('text-white');
    });
})