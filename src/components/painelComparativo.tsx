import { useEffect } from 'react';
import { compararTipos } from '@/utils/tipoVantagem';
import { compararRaridade } from '@/utils/comparaRaridade';
import { useHistorico } from '@/hooks/useHistorico';

export default function PainelComparativo({ card1, card2 }: { card1: any, card2: any }) {
    const { adicionarHistorico } = useHistorico();
    
    useEffect(() => {
        if (card1 && card2) {
            const historicoCard = {
                card1: {
                    id: card1.id,
                    nome: card1.name,
                    img: card1.image,
                    hp: cardHp1,
                    tipo: cardTipo1,
                    iconeTipo: tipoIconesEmoji[cardTipo1],
                    raridade: cardRaridade1,
                    ataque: maiorAtaque1
                },
                card2: {
                    id: card2.id,
                    nome: card2.name,
                    img: card2.image,
                    hp: cardHp2,
                    tipo: cardTipo2,
                    iconeTipo: tipoIconesEmoji[cardTipo2],
                    raridade: cardRaridade2,
                    ataque: maiorAtaque2
                },
                comparativo: {
                    hp: resultadoHp(),
                    tipo: resultadoTipo(),
                    raridade: resultadoRaridade(),
                    ataque: resultadoAtaque()
                }
            };
            adicionarHistorico(historicoCard);
        }
    }, [card1, card2]);

    const cardNome1 = card1?.name || "Nome da carta";
    const cardTipo1 = card1?.types?.[0] || "Tipo da carta";
    const cardHp1 = card1?.hp || "HP da carta";
    const cardRaridade1 = card1?.rarity || "Raridade da carta";
    const cardAtaques1: Ataque[] = card1?.attacks || [];

    const cardNome2 = card2?.name || "Nome da carta";
    const cardTipo2 = card2?.types?.[0] || "Tipo da carta";
    const cardHp2 = card2?.hp || "HP da carta";
    const cardRaridade2 = card2?.rarity || "Raridade da carta";
    const cardAtaques2: Ataque[] = card2?.attacks || [];

    const tipoIconesEmoji: Record<string, string> = {
    Planta: '🌿',
    Fogo: '🔥',
    Água: '💧',
    Elétrico: '⚡',
    Psíquico: '🔮',
    Lutador: '🥊',
    Noturno: '🌙',
    Metal: '🛡️',
    Dragão: '🐉',
    Fada: '✨',
    Normal: '🎯',
    Venenoso: '☠️',
    Inseto: '🐛',
    Rocha: '⛰️',
    Fantasma: '👻',
    Gelo: '❄️',
    Sombrio: '🕷️',
    Incolor: '🌫️',
    Terrestre: '🏜️',
    Aéreo: '💨',
    };

    let maiorAtaque1 = 0;
    let maiorAtaque2 = 0;

    interface Ataque {
        name: string;
        damage: string;
        cost: string[];
    }

    const resultadoHp = () => {
        if (cardHp1 > cardHp2) return { nome: cardNome1, cor: "text-blue-500" };
        if (cardHp1 < cardHp2) return { nome: cardNome2, cor: "text-red-500" };
        return { nome: "Empate!", cor: "text-yellow-400" };
    };

    const resultadoTipo = () => {
        const resultado = compararTipos(cardTipo1, cardTipo2);
        if (resultado === 1) return { nome: cardNome1, cor: "text-blue-500" };
        if (resultado === 2) return { nome: cardNome2, cor: "text-red-500" };
        return { nome: "Sem Vantagens!", cor: "text-yellow-400" };
    };

    const resultadoRaridade = () => {
        const resultado = compararRaridade(cardRaridade1, cardRaridade2);
        if (resultado === 1) return { nome: cardNome1, cor: "text-blue-500" };
        if (resultado === 2) return { nome: cardNome2, cor: "text-red-500" };
        return { nome: "Empate!", cor: "text-yellow-400" };
    };

    const resultadoAtaque = () => {
        maiorAtaque1 = Math.max(...cardAtaques1.map((ataque) => {
            if(typeof ataque.damage === "number") {
                return ataque.damage;
            }else if(/\d+\+$/.test(ataque.damage)){
                return parseInt(ataque.damage);
            }
            return 0;
        }, 0));
        maiorAtaque2 = Math.max(...cardAtaques2.map((ataque) => {
            if(typeof ataque.damage === "number") {
                return ataque.damage;
            } else if(/\d+\+$/.test(ataque.damage)){
                return parseInt(ataque.damage);
            }
            return 0;
        }, 0));
        if (maiorAtaque1 > maiorAtaque2) return { nome: cardNome1, cor: "text-blue-500" };
        if (maiorAtaque1 < maiorAtaque2) return { nome: cardNome2, cor: "text-red-500" };
        return { nome: "Empate!", cor: "text-yellow-400" };
    }

    const { nome: nomeVencedorHp, cor: corVencedorHp } = resultadoHp();
    const { nome: nomeVencedorTipo, cor: corVencedorTipo } = resultadoTipo();
    const { nome: nomeVencedorRaridade, cor: corVencedorRaridade } = resultadoRaridade();
    const { nome: nomeVencedorAtaque, cor: corVencedorAtaque } = resultadoAtaque();


    return (
        <div className="grid grid-cols-4 gap-4 bg-gray-900 rounded-xl py-4 px-4">
            <div className={`col-span-1 row-start-1 flex justify-center items-center border-1 ${corVencedorHp} rounded-xl h-full py-2`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-1xl font-bold text-white">❤️ HP</h1>
                    <h1 className="text-[16px] font-medium text-white text-center">{cardHp1} <span className='font-bold'>X</span> {cardHp2}</h1>
                    <h1 className={`text-1xl font-bold text-center ${corVencedorHp}`}>{nomeVencedorHp}</h1>
                </div>
            </div>
            <div className={`col-span-1 row-start-1 flex justify-center items-center border-1 ${corVencedorAtaque} rounded-xl h-full py-2`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-1xl font-bold text-white">⚔️ Ataque</h1>
                    <h1 className="text-[16px] font-medium text-white text-center">{maiorAtaque1} <span className='font-bold'>X</span> {maiorAtaque2}</h1>
                    <h1 className={`text-1xl font-bold text-center ${corVencedorAtaque}`}>{nomeVencedorAtaque}</h1>
                </div>
            </div>
            <div className={`col-span-1 row-start-1 flex justify-center items-center border-1 ${corVencedorTipo} rounded-xl h-full py-2`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-1xl font-bold text-white">Tipo</h1>
                    <h1 className="text-[16px] font-medium text-white text-center">{tipoIconesEmoji[cardTipo1]}{cardTipo1} <span className='font-bold'>X</span> {tipoIconesEmoji[cardTipo2]}{cardTipo2}</h1>
                    <h1 className={`text-1xl font-bold text-center ${corVencedorTipo}`}>{nomeVencedorTipo}</h1>
                </div>
            </div>
            <div className={`col-span-1 row-start-1 flex justify-center items-center border-1 ${corVencedorRaridade} rounded-xl h-full py-2`}>
                <div className="flex flex-col items-center">
                    <h1 className="text-1xl font-bold text-white">💎 Raridade</h1>
                    <h1 className="text-[16px] font-medium text-white text-center">{cardRaridade1} <span className='font-bold'>X</span> {cardRaridade2}</h1>
                    <h1 className={`text-1xl font-bold text-center ${corVencedorRaridade}`}>{nomeVencedorRaridade}</h1>
                </div>
            </div>
        </div>
    )
}