import { useState } from "react";
import Autocomplete from "./autocomplete";
import CarrosselCards from "./CarrosselCards";
import { getCardById } from "../services/tcgdexService";
import { useListaCard } from "../context/ListaCardsContext";

interface Props {
  carregarCard:(card:any) => void;
}

export default function ModalSelectCards({carregarCard}:Props) {

    const lista = useListaCard();

    const [listaDisplay, setListaDisplay] = useState<any[]>([]);
    const [carregandoLista, setCarregandoLista] = useState<boolean>(false);
    const [card, setCardSelecionado] = useState(null);

    const nomeSelecionado = (nome: string) => {
        buscarCards(nome);
    }

    const buscarCards = async (filtroSelecionado:string) => {
        let listaGrid = [];
        setCardSelecionado(null);
        setCarregandoLista(true);
        const cardsEncontrados = lista.filter((item) =>{
            return item.name == filtroSelecionado;
        });
        for (let index = 0; index < cardsEncontrados.length; index++) {
            const cartaCompleta = await getCardById(cardsEncontrados[index].id);
            listaGrid.push(cartaCompleta);
        }
        setListaDisplay(listaGrid);
        setCarregandoLista(false);
    }

    const cardSelecionado = (card:any) => {
        setCardSelecionado(card);
    }

    return (
        <div
        className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
        role="dialog"
        id="modalSelectCard"
        aria-modal="true"
        aria-labelledby="modalTitle"
        >
            <div className="w-full max-w-md min-w-[360px] md:min-w-[850px] 2xl:min-w-[1100px] h-[650px] rounded-lg p-6 shadow-lg bg-gray-900">
                <div className="flex items-start justify-between">
                    <h2 id="modalTitle" className="text-xl font-bold sm:text-2xl text-white">
                        Buscar cards
                    </h2>

                    <button
                        type="button"
                        className="-me-4 -mt-4 cursor-pointer rounded-full p-2 transition-colors focus:outline-none text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                        aria-label="Close"
                        onClick={()=>{carregarCard(null)}}
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                        </svg>
                    </button>
                </div>

                <div className="mt-4 body h-[480px] grid grid-cols-1">
                    <div className="col-span-1">
                        <Autocomplete onSelecionar={nomeSelecionado} numero={2}/>
                    </div>
                    { (listaDisplay.length > 0 || carregandoLista) && (
                    <div className="col-span-1">
                        <CarrosselCards listaDisplay={listaDisplay} cardSelecionado={cardSelecionado} carregandoLista={carregandoLista}/>
                    </div>
                    )}
                    { listaDisplay.length == 0 && !carregandoLista && (
                        <div className="col-span-1">
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="bg-gray-700 rounded-xl w-[250px] h-[345px] shadow-lg mb-4 flex items-center justify-center">
                                    <span className="text-gray-500 text-7xl">?</span>
                                </div>
                                <p className="text-gray-400">Nenhum card ainda...<br />Digite o nome para começar a busca.</p>
                            </div>
                        </div>
                    )}

                </div>

                <footer className="mt-9 flex justify-center sm:justify-end gap-2">
                    <button
                        type="button"
                        className="rounded cursor-pointer w-2/4 sm:w-auto px-4 py-2 text-sm font-bold transition-colors bg-gray-800 text-gray-200 hover:bg-gray-700"
                        onClick={()=>{carregarCard(null)}}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={`rounded ${card ? 'cursor-pointer bg-blue-600 hover:bg-blue-700' : 'bg-gray-500'} w-2/4 sm:w-auto px-4 py-2 text-sm font-bold text-white transition-colors`}
                        disabled={!card}
                        onClick={()=>{carregarCard(card)}}
                    >
                        Confirmar
                    </button>
                </footer>
            </div>
        </div>
    );
}