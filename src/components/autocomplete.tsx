import { useState } from "react";
import Image from "next/image";
import { useListaCard } from "../contexts/ListaCardsContext";

interface AutocompleteProps {
  onSelecionar: (name: string) => void;
  numero:number;
}

export default function Autocomplete({onSelecionar}:AutocompleteProps) {

const lista = useListaCard();

const [filtro, setFiltro] = useState("");
const [listaFiltrada, setListaFiltrada] = useState(lista);
const [filtroSelecionado, setFiltroSelecionado] = useState("");
const [filtroAberto, setFiltroAberto] = useState(false);

const filtrarLista = (filtro: string) => {
    setFiltro(filtro);
    if (filtro === "" || filtro.length < 3) {
        setFiltroAberto(false);
        setListaFiltrada(lista);
        return;
    }

    let listaCache:Array<string> = [];
    const cardsEncontrados = lista.filter((item) =>{
        const nomeItem = item.name.toLowerCase();
        let itemEncontrado = nomeItem.includes(filtro.toLowerCase());
        if(itemEncontrado && !listaCache.includes(nomeItem)){
            listaCache.push(nomeItem);
            return true;
        }
        return false;
    });

    if (cardsEncontrados.length === 0) {
        setFiltroAberto(false);
        return;
    }
    setFiltroAberto(true);
    setListaFiltrada(cardsEncontrados);
};

const handleFiltroClick = (item: any) => {
    setFiltroSelecionado(item.name);
    setFiltroAberto(false);
    onSelecionar(item.name);
};

const handleFiltroBlur = () => {
    setTimeout(() => {
        setFiltroAberto(false);
    }, 100);
};

return (
    <div className="flex flex-col items-center">
        <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="w-full px-4">
                <div className="flex flex-col items-center relative">
                    <div className="w-full">
                        <div className="my-2 p-1 bg-gray-800 flex border border-gray-800">
                            <div className="flex flex-auto flex-wrap"></div>
                            <input id="filtroCards" placeholder="Digite 3 ou mais caracteres para iniciar a busca" className="p-1 px-2 appearance-none outline-none w-full text-gray-200"  
                                onChange={(e) => {
                                    filtrarLista(e.target.value);
                                }}
                                onBlur={handleFiltroBlur}
                            />
                            <div className="text-gray-300 w-8 py-1 pl-2 mr-2 pr-1 flex items-center"
                            onClick={()=>{
                                (document?.querySelector("#filtroCards") as HTMLInputElement)?.focus();
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
                    {filtroAberto && (
                    <div className="absolute shadow bg-gray-300 top-[50px] z-40 w-full lef-0 max-h-[200px] overflow-y-auto">
                        {listaFiltrada.map((item,index) => (
                        <div 
                            className="flex flex-col w-full"
                            key={index}
                            onClick={() => handleFiltroClick(item)}                            
                        >
                            <div className="cursor-pointer w-full border-gray-300 rounded-t border-b hover:bg-gray-100">
                                <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-gray-100">
                                    <div className="w-full items-center flex">
                                        <div className="mx-2 text-gray-800">{item.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
}