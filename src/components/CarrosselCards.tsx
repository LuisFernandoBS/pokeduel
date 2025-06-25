import Image from "next/image";
import { useState, useEffect } from "react";

interface Card {
  id: string;
  image: string;
}

interface Props {
  listaDisplay: Card[];
  cardSelecionado:(card:any) => void;
  carregandoLista:boolean;
}

export default function CarrosselCards({ listaDisplay, cardSelecionado, carregandoLista }: Props) {
    const [indexAtual, setIndexAtual] = useState(0);
    const [indexCardSelecionado, setIndexCardSelecionado] = useState<number|null>(null);
    const totalSlides = Math.ceil(listaDisplay.length / 3);
    const [loadingCards, setLoadingCards] = useState<number[]>([]);


    useEffect(() => {
        setIndexAtual(0);
        setIndexCardSelecionado(null);
        setLoadingCards([]);
    }, [listaDisplay]);

    const marcarCardComoCarregado = (index: number) => {
        setLoadingCards((prev) => {
            if (prev.includes(index)) return prev;
            return [...prev, index];
        });
    };
  
    const proximoSlide = () => {
    setIndexAtual((prev) => Math.min(prev + 1, totalSlides - 1));
    };

    const slideAnterior = () => {
    setIndexAtual((prev) => Math.max(prev - 1, 0));
    };

  return (
    <div className="relative w-full">
        {!carregandoLista ? 
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                    transform: `translateX(-${indexAtual * (100 / totalSlides)}%)`,
                    width: `${totalSlides * 100}%`,
                }}
            >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className="flex justify-center px-4"
                        style={{ width: `${100 / totalSlides}%` }}
                    >
                    {listaDisplay
                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                    .map((card, index) => {
                        const realIndex = slideIndex * 3 + index;
                        return (
                        <div key={realIndex} className="pt-10 px-3 pb-5">
                            {loadingCards.length != listaDisplay.length && (
                                <div className="inset-0 bg-gray-600 animate-pulse rounded-2xl w-[250px] h-[345px]" />
                            )}
                            <Image
                            src={`${card.image}/high.webp`}
                            alt="card"
                            width={250}
                            height={400}
                            loading="eager"
                            className={`object-cover h-[280px] w-[250px] md:w-[190px] cursor-pointer mb-5 rounded-2xl md:rounded-xl transition hover:scale-[105%] ${indexCardSelecionado === realIndex && 'shadow-[-1px_2px_39px_-4px_rgba(56,95,230,0.95)]'} ${loadingCards.length == listaDisplay.length ? '' : 'hidden'}`}
                            onLoad={() => {
                                marcarCardComoCarregado(realIndex);
                            }}
                            onClick={()=>{
                                cardSelecionado(card);
                                setIndexCardSelecionado(realIndex);
                            }}
                            />
                        </div>
                    )})}
                    </div>
                ))}
            </div>

            <button
                onClick={slideAnterior}
                className={`absolute ${indexAtual !== 0 && 'cursor-pointer hover:bg-gray-700'} top-1/2 left-0  transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded ml-10 disabled:opacity-50`}
                disabled={indexAtual === 0}
            >
                ◀
            </button>
            <button
                onClick={proximoSlide}
                className={`absolute ${indexAtual !== totalSlides - 1 && 'cursor-pointer hover:bg-gray-700'} top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded mr-10 disabled:opacity-50`}
                disabled={indexAtual === totalSlides - 1}
            >
                ▶
            </button>
        </div>
        : 
        <div className="justify-items-center text-center align-middle h-100">
            <Image 
            width={100}
            height={100}
            id="imagem-carregamento"
            className="absolute top-[40%] left-[48%]"
            alt="Carregando"
            src={'/assets/img/pokeball.png'}
            />
        </div>
        }
    </div>
  );
}
