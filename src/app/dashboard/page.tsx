'use client';
import Header from "@/components/header";
import GraficoBarrasSimples from "@/components/GraficoBarrasSimples";
import GraficoBarrasDuplas from "@/components/GraficoBarrasDuplas";
import GraficoPie from "@/components/GraficoPie";
import GraficoRadar from "@/components/GraficoRadar";
import { useHistorico } from '@/hooks/useHistorico';
import { useMemo, useEffect, useState } from "react";

interface TipoMaisDuelado {
    tipo: string;
    quantidade: number;
}

interface listaCardDuelados {
    nomeCard: string;
    hp: number;
    ataque: number;
}

export default function Dashboard() {
    const { historico } = useHistorico();

    const [tipoMaisDuelado, setTipoMaisDuelado] = useState<TipoMaisDuelado>({tipo: '', quantidade: 0});
    const [iconeTipoMaisDuelado, setIconeTipoMaisDuelado] = useState<string>("");
    const [listaCardDuelados, setListaCardDuelados] = useState<listaCardDuelados[]>([]);
    const [listaCardsVitoriaPorAtributoGrafico, setListaCardsVitoriaPorAtributoGrafico] = useState<any>([]);

    const totalDuelos = historico.length;

    const totalDeEmpates = historico.reduce((count, duelo) => {
        if (duelo.comparativo.cardVencedor === 0) {
            return count + 1;
        }
        return count;
    }, 0);
    
    const maiorHP = historico.reduce((max, duelo) => {
            const hp1 = parseInt(duelo.card1.hp);
            const hp2 = parseInt(duelo.card2.hp);
            return Math.max(max, hp1, hp2);
        }
    , 0);

    const ataqueHP = historico.reduce((max, duelo) => {
            const ataque1 = duelo.card1.ataque;
            const ataque2 = duelo.card2.ataque;
            return Math.max(max, ataque1, ataque2);
        }
    , 0);

    const tiposQtdDuelos = useMemo(() => {
        return historico.reduce<Record<string, number>>((tipos, duelo) => {
            const tipo1 = duelo.card1.tipo;
            const tipo2 = duelo.card2.tipo;
            tipos[tipo1] = (tipos[tipo1] || 0) + 1;
            tipos[tipo2] = (tipos[tipo2] || 0) + 1;
            return tipos;
        }, {});
    }, [historico]);

    const buscarIconeTipoMaisDuelado = (tipo: string) => {
        historico.forEach((duelo) => {
            if (duelo.card1.tipo === tipo) {
                setIconeTipoMaisDuelado(duelo.card1.iconeTipo);
                return;
            }
            if (duelo.card2.tipo === tipo) {
                setIconeTipoMaisDuelado(duelo.card2.iconeTipo);
                return;
            }
            return;
        });  
    }

    const listaCardsDuelados = () => {
        const set = new Set<string>();
        const lista: { nomeCard: string; hp: number; ataque: number }[] = [];

        historico.forEach((duelo) => {
            const card1 = {
                nomeCard: duelo.card1.nome,
                hp: parseInt(duelo.card1.hp),
                ataque: duelo.card1.ataque,
            };
            const card2 = {
                nomeCard: duelo.card2.nome,
                hp: parseInt(duelo.card2.hp),
                ataque: duelo.card2.ataque,
            };

            const str1 = JSON.stringify(card1);
            const str2 = JSON.stringify(card2);

            if (!set.has(str1)) {
                set.add(str1);
                lista.push(card1);
            }
            if (!set.has(str2)) {
                set.add(str2);
                lista.push(card2);
            }
        });

        return lista;
    };

    const listaCardsVitoriaDeCada = () => {
        const listaCard:{idCard:string;vitorias:number;nomeCard:string,indexVitorias:number[]}[] = [];

        historico.forEach((duelo,indexHistorico) => {
            
            if (duelo.comparativo.cardVencedor === 1) {
                const index = listaCard.findIndex((card => card.idCard === duelo.card1.id));
                if (index !== -1) {
                    listaCard[index].vitorias += 1;
                    listaCard[index].indexVitorias.push(indexHistorico);
                    return;
                }
                listaCard.push({idCard: duelo.card1.id, vitorias: 1, nomeCard: duelo.card1.nome, indexVitorias: [indexHistorico]});
            } else if (duelo.comparativo.cardVencedor === 2) {
                const index = listaCard.findIndex((card => card.idCard === duelo.card2.id));
                if (index !== -1) {
                    listaCard[index].vitorias += 1;
                    listaCard[index].indexVitorias.push(indexHistorico);
                    return;
                }
                listaCard.push({idCard: duelo.card2.id, vitorias: 1, nomeCard: duelo.card2.nome, indexVitorias: [indexHistorico]});
            }
        });

        return listaCard;
    }

    const listaCardsMaiorNumeroVitoria = () => {
        const listaCard = listaCardsVitoriaDeCada();
        if (listaCard.length === 0) return [];
        const maiorVitoria = Math.max(...listaCard.map(card => card.vitorias));
        return listaCard.filter(card => card.vitorias === maiorVitoria);
    }

    const listaCardsVitoriaPorAtributo = (listaCard:{idCard:string; vitorias:number; nomeCard: string; indexVitorias:number[]}[]) => {
        const lista : any[] = [];        
        listaCard.forEach((card)=>{
            let hp = 0;
            let ataque = 0;
            let tipo = 0;
            let raridade = 0;
            const historicoCard = historico.filter((duelo, indexHistorico) => card.indexVitorias.includes(indexHistorico));
            historicoCard.map((duelo) => {
                hp += duelo.comparativo.hp.nome == card.nomeCard ? 1 : 0;
                ataque += duelo.comparativo.ataque.nome == card.nomeCard ? 1 : 0;
                tipo += duelo.comparativo.tipo.nome == card.nomeCard ? 1 : 0;
                raridade += duelo.comparativo.raridade.nome == card.nomeCard ? 1 : 0;
            }, 0);
            lista.push({
                nomeCard: card.nomeCard,
                hp: hp,
                ataque: ataque,
                tipo: tipo,
                raridade: raridade
            });
        })
        return lista;
    }

    const gerarListaCardsVitoriaPorAtributo = (listaCard:{nomeCard:string; hp:number; ataque: number; tipo:number; raridade:number}[]) => {
        let maiorQuantidadeVitoriaPorAtributo = 0;
        const listaHP:any = {subject: 'HP'};
        const listaAtaque:any = {subject: 'Ataque'};
        const listaTipo:any = {subject: 'Tipo'};
        const listaRaridade:any = {subject: 'Raridade'};
        listaCard.forEach(card => {
            listaHP[card.nomeCard] = card.hp;
            listaAtaque[card.nomeCard] = card.ataque;
            listaTipo[card.nomeCard] = card.tipo;
            listaRaridade[card.nomeCard] = card.raridade;
            maiorQuantidadeVitoriaPorAtributo = Math.max(maiorQuantidadeVitoriaPorAtributo, card.hp, card.ataque, card.tipo, card.raridade);
        });
        listaHP.fullMark = maiorQuantidadeVitoriaPorAtributo;
        listaAtaque.fullMark = maiorQuantidadeVitoriaPorAtributo;
        listaTipo.fullMark = maiorQuantidadeVitoriaPorAtributo;
        listaRaridade.fullMark = maiorQuantidadeVitoriaPorAtributo;
        return [
            listaHP,
            listaAtaque,
            listaTipo,
            listaRaridade
        ];
    }

    useEffect(() => {
        setListaCardDuelados(listaCardsDuelados());
        const retornoListaCardVitoria = listaCardsMaiorNumeroVitoria();    
        const retornoListaCardVitoriaPorAtributo = listaCardsVitoriaPorAtributo(retornoListaCardVitoria);
        setListaCardsVitoriaPorAtributoGrafico(gerarListaCardsVitoriaPorAtributo(retornoListaCardVitoriaPorAtributo))
    }, [historico]);

    useEffect(() => {
        if(tiposQtdDuelos === null || Object.keys(tiposQtdDuelos).length === 0) {
            setTipoMaisDuelado({tipo: '', quantidade: 0});
            return;
        }
        const tipoComMaisDuelos = Object.entries(tiposQtdDuelos).reduce((maiorEncontrado, tipoAtual) => maiorEncontrado[1] > tipoAtual[1] ? maiorEncontrado : tipoAtual);
        const exiteMaisDeUmTipoComMaisDuelos: boolean = Object.entries(tiposQtdDuelos).filter((tipo) => tipo[1] === tipoComMaisDuelos[1]).length > 1;
        if(exiteMaisDeUmTipoComMaisDuelos) {
            setTipoMaisDuelado({tipo: `Vários com ${tipoComMaisDuelos[1]} duelos`, quantidade: 0});
            setIconeTipoMaisDuelado('');
            return;
        }
        setTipoMaisDuelado(tipoComMaisDuelos ? {tipo:tipoComMaisDuelos[0],quantidade:tipoComMaisDuelos[1]} : {tipo: '', quantidade: 0});
        buscarIconeTipoMaisDuelado(tipoComMaisDuelos[0]);
    }, [tiposQtdDuelos]);


    return (
        <div className="items-center justify-center h-screen text-center">
            <div className="py-5 h-auto max-h-[120px]">
                <Header page="dashboard" />
            </div>
            <h1 className="text-2xl text-gray-300 mb-4 mt-15 font-pokeduel">Dashboard de Duelos</h1>
            <div className="grid grid-cols-5 2xl:grid-cols-14 sm:gap-2 md:gap-4 w-full sm:px-2 md:px-5 2xl:px-0 pb-3">
                <div className="col-span-5 col-start-1 2xl:col-span-8 2xl:col-start-4 row-start-2 flex justify-end items-center">
                    <div className='grid w-full grid-cols-2 md:grid-cols-4 grid-rows-1 gap-2 md:gap-7 px-3 md:px-0'>
                        <div 
                        className="col-span-1 flex flex-col items-center justify-center text-center min-h-[120px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            <div className="text-md font-semibold">Total de duelos</div>
                            <div className="text-4xl font-bold my-3">{totalDuelos}</div>
                        </div>                            
                        <div 
                        className="col-span-1 flex flex-col items-center justify-center text-center min-h-[120px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            <div className="text-md font-semibold">Maior HP dos duelos</div>
                            <div className="text-4xl font-bold my-3">{maiorHP}</div>
                        </div>                            
                        <div 
                        className="col-span-1 flex flex-col items-center justify-center text-center min-h-[120px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            <div className="text-md font-semibold">Maior ataque dos duelos</div>
                            <div className="text-4xl font-bold my-3">{ataqueHP}</div>
                        </div>                            
                        <div 
                        className="col-span-1 flex flex-col items-center justify-center text-center min-h-[120px] rounded-2xl text-gray-300 bg-gray-800 py-5 px-4"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            <div className="text-md font-semibold">Tipo com mais duelos</div>
                            <div className={`${tipoMaisDuelado.tipo && tipoMaisDuelado.tipo.length < 12 ? 'text-2xl':'text-xl'} font-bold my-3`}>{tipoMaisDuelado.tipo && (`${iconeTipoMaisDuelado}${tipoMaisDuelado.tipo}`)}</div>
                            {/* <div className="text-lg font-bold mb-3 mt-0">{tipoMaisDuelado.tipo ? tipoMaisDuelado.tipo : '-'}</div> */}
                        </div>
                        
                        <div 
                        className="col-span-2 flex flex-col items-center justify-center text-center min-h-[300px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            {tiposQtdDuelos === null || Object.keys(tiposQtdDuelos).length === 0 ? (
                                <div className="text-md font-semibold">Nenhum duelo registrado</div>
                            ) : (
                                <>
                                    <div className="text-md font-semibold">Duelos com Vitoria/Empatados</div>
                                    <GraficoPie dados={[{name:'Partidas com Vencedor',value:totalDuelos - totalDeEmpates},{name:'Partidas Empatadas',value:totalDeEmpates}] } />
                                </>
                            )}
                        </div>
                        <div 
                        className="col-span-2 flex flex-col items-center justify-center text-center min-h-[300px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            {tiposQtdDuelos === null || Object.keys(tiposQtdDuelos).length === 0 ? (
                                <div className="text-md font-semibold">Nenhum duelo registrado</div>
                            ) : (
                                <>
                                    <div className="text-md font-semibold">Tipos de cartas e suas quantidades de duelos</div>
                                    <GraficoBarrasSimples dados={
                                        Object.entries(tiposQtdDuelos).map(([tipo, quantidade]) => ({
                                            tipo,
                                            quantidade
                                        }))
                                    } />
                                </>
                            )}
                        </div>
                        <div 
                        className="col-span-2 flex flex-col items-center justify-center text-center min-h-[500px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            {listaCardDuelados === null || listaCardDuelados.length === 0 ? (
                                <div className="text-md font-semibold">Nenhum duelo registrado</div>
                            ) : (
                                <>
                                    <div className="text-md font-semibold">Cartas e seus atributos de HP/Ataques </div>
                                    <GraficoBarrasDuplas dados={listaCardDuelados} />
                                </>
                            )}
                        </div>
                        <div 
                        className="col-span-2 flex flex-col items-center justify-center text-center min-h-[500px] rounded-2xl text-gray-300 bg-gray-800 py-5"
                        style={{boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'}}
                        >
                            {listaCardsVitoriaPorAtributoGrafico === null || listaCardsVitoriaPorAtributoGrafico.length === 0 ? (
                                <div className="text-md font-semibold">Nenhum duelo registrado</div>
                            ) : (
                                <>
                                    <div className="text-md font-semibold">Desempenho por Atributo nas Cartas Campeãs</div>
                                    <GraficoRadar dados={listaCardsVitoriaPorAtributoGrafico} />
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}