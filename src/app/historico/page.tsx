'use client'
import { useEffect, useState } from 'react';
import Image from "next/image";
import Header from "@/components/header";
import ModalImagemCard from "@/components/modalImagemCard";
import { useHistorico } from '@/hooks/useHistorico';


export default function Historico() {
    const { historico } = useHistorico();
    const [listaHistorico, setListaHistorico] = useState<any[]>([]);
    const [urlImagemCard, setUrlImagemCard] = useState<string>("");
    const [aparecendo, setAparecendo] = useState(false);

    useEffect(() => {
        if(historico.length !== 0) {
            setListaHistorico(historico);
        }        
    }, [historico]);

    useEffect(() => {
        const timeout = setTimeout(() => setAparecendo(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const abrirModalImagemCard = (urlImagem: string) => {
        setUrlImagemCard(urlImagem);
    };

    const filtrarDuelos = (textoFiltro: string) => {
        const filtro = textoFiltro.toLowerCase();
        
        setAparecendo(false);

        setTimeout(() => {
            if (textoFiltro === "") {
                setListaHistorico(historico);
            } else {
                const duelosFiltrados = listaHistorico.filter((duelo) => {
                    const card1Nome = duelo.card1.nome.toLowerCase();
                    const card2Nome = duelo.card2.nome.toLowerCase();
                    
                    return card1Nome.includes(filtro) || card2Nome.includes(filtro);
                })
                setListaHistorico(duelosFiltrados);
            }
            setTimeout(() => {
                setAparecendo(true)
            }, 50);
        }, 500);
    };

    return (
        <div className="items-center justify-center h-screen text-center">
            {urlImagemCard && <ModalImagemCard urlImagem={urlImagemCard} fecharImagem={setUrlImagemCard} />
            }
            <div className="py-5 h-auto max-h-[120px]">
                <Header page="historico" />
            </div>
            <h1 className="text-2xl font-bold mb-4 mt-15">Histórico de Duelo</h1>
            
            <div className="grid grid-cols-5 2xl:grid-cols-14 gap-4 w-full px-5 2xl:px-0 pb-3">
                <div className="col-span-5 col-start-1 2xl:col-span-8 2xl:col-start-4  row-start-2 flex justify-end items-center">
                    <div className='grid w-full grid-cols-1 grid-rows-1'>

                        <div className="col-span-1 flex justify-center items-center p-0 shadow-md mb-5">
                            <div className="w-full p-3 bg-gray-900 flex border-2 border-gray-800 rounded-lg">
                                <div className="flex flex-auto flex-wrap"></div>
                                <input id="filtroDuelos" placeholder="Digite nome do card para iniciar a busca" className="p-2 px-2 appearance-none outline-none w-full text-[19px] text-gray-200"  
                                    onChange={(e) => {
                                        filtrarDuelos(e.target.value);
                                    }}
                                />
                                <div className="text-gray-300 w-8 py-1 pl-2 mr-2 pr-1 flex items-center"
                                onClick={()=>{
                                    (document?.querySelector("#filtroDuelos") as HTMLInputElement)?.focus();
                                }}
                                >
                                    <button className="w-6 h-6 text-gray-600 outline-none focus:outline-none">
                                        <Image 
                                        src="/assets/img/search.png"
                                        alt="pokeduel"
                                        width={60}
                                        height={60}
                                        className="rounded object-cover rotate-270"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {listaHistorico.map((duelo, index) => (
                            <div key={index} 
                            style={{ transitionDelay: `${index * 100}ms` }} 
                            className={`col-span-1 flex justify-center items-center p-3 bg-gray-800 rounded-lg shadow-md my-1 hover:bg-gray-700 transition-opacity duration-500 ${aparecendo ? `opacity-100` : 'opacity-0'}`}
                            >
                                <div className='grid w-full grid-cols-6 grid-rows-1 gap-1'>
                                    <div className="col-span-2 flex justify-center items-center p-4 bg-gray-900 border border-red-500 rounded-lg ">
                                        <h2 className='text-[15px] font-medium text-white flex items-center'>
                                            <Image
                                                src={`${duelo.card1.img}/high.webp`}
                                                alt="card1"
                                                width={50}
                                                height={80}
                                                className="object-cover mr-3 cursor-pointer"
                                                onClick={() => abrirModalImagemCard(duelo.card1.img)}
                                            />
                                            <span className={`mr-2 ${duelo.comparativo.cardVencedor == 1 ? 'text-yellow-500 font-bold' : 'text-white'}`}>
                                                {`${duelo.comparativo.cardVencedor == 1?'👑':''}`} {duelo.card1.nome}
                                            </span>
                                            X 
                                            <span className={`ml-2 ${duelo.comparativo.cardVencedor == 2 ? 'text-yellow-500 font-bold' : 'text-white'}`}>
                                                {`${duelo.comparativo.cardVencedor == 2?'👑':''}`} {duelo.card2.nome}
                                            </span>
                                            <Image
                                                src={`${duelo.card2.img}/high.webp`}
                                                alt="card1"
                                                width={50}
                                                height={80}
                                                className="object-cover ml-3 cursor-pointer"
                                                onClick={() => abrirModalImagemCard(duelo.card2.img)}
                                            />
                                        </h2>
                                    </div>
                                    <div className="col-span-1 flex flex-col h-full justify-center p-4 bg-gray-900 border border-amber-500 rounded-lg ">
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white text-center w-full'>❤️ HP</h2>
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white'>{duelo.card1.hp} X {duelo.card2.hp}</h2>
                                    </div>
                                    <div className="col-span-1 flex flex-col h-full justify-center p-4 bg-gray-900 border border-amber-500 rounded-lg ">
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white text-center w-full'>⚔️ Ataque</h2>
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white'>{duelo.card1.ataque} X {duelo.card2.ataque}</h2>
                                    </div>
                                    <div className="col-span-1 flex flex-col h-full justify-center p-4 bg-gray-900 border border-amber-500 rounded-lg ">
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white text-center w-full'>Tipo</h2>
                                        <h2 className='text-[12px] 2xl:text-[14px] font-medium text-white'>{duelo.card1.iconeTipo}{duelo.card1.tipo} X {duelo.card2.iconeTipo}{duelo.card2.tipo}</h2>
                                    </div>
                                    <div className="col-span-1 flex flex-col h-full justify-center p-4 bg-gray-900 border border-amber-500 rounded-lg ">
                                        <h2 className='text-[15px] 2xl:text-[17px] font-medium text-white text-center w-full'>💎 Raridade</h2>
                                        <h2 className='text-[12px] 2xl:text-[14px] font-medium text-white'>{duelo.card1.raridade} X {duelo.card2.raridade}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            { listaHistorico.length == 0 &&
                <p className="text-gray-500">Nenhum duelo encontrado.</p>
            }
        </div>
    );
}