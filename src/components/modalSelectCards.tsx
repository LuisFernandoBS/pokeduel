import { useState } from "react";
import Autocomplete from "./autocomplete";
import CarrosselCards from "./CarrosselCards";
import { getCardById } from "../services/tcgdexService";
import { useListaCard } from "../context/ListaCardsContext";

export default function ModalSelectCards() {

    const lista = useListaCard();

    const [listaDisplay, setListaDisplay] = useState<any[]>([]);
    const [carregandoLista, setCarregandoLista] = useState<boolean>(false);

    const nomeSelecionado = (nome: string) => {
        buscarCards(nome);
    }

    const buscarCards = async (filtroSelecionado:string) => {
        let listaGrid = [];
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
        console.log(card);
    }

    return (
        <div
        className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        >
            <div className="w-full max-w-md min-w-[1100px] h-[650px] rounded-lg p-6 shadow-lg bg-gray-900">
                <div className="flex items-start justify-between">
                    <h2 id="modalTitle" className="text-xl font-bold sm:text-2xl text-white">
                        Buscar cards
                    </h2>

                    <button
                        type="button"
                        className="-me-4 -mt-4 rounded-full p-2 transition-colors focus:outline-none text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                        aria-label="Close"
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
                    <div className="col-span-1">
                        <CarrosselCards listaDisplay={listaDisplay} cardSelecionado={cardSelecionado} carregandoLista={carregandoLista}/>
                    </div>
                </div>

                <footer className="mt-9 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded cursor-pointer px-4 py-2 text-sm font-bold transition-colors bg-gray-800 text-gray-200 hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rounded cursor-pointer bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                        disabled
                    >
                        Confirmar
                    </button>
                </footer>
            </div>
        </div>
    );
}