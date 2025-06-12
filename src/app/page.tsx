'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import Header from "../components/header";
import Card from "../components/card";
import ModalSelectCards from "../components/modalSelectCards";
import PainelComparativo from "../components/painelComparativo";
import { getAllCards, getCardById } from "../services/tcgdexService";
import { ListaCardProvider } from "../context/ListaCardsContext";
import { CartasExcluidasSet } from "../data/listaCartasExcluidas"

interface CardSimples {
  id: string;
  name: string;
  localId: string;
  image?: string;
}

export default function Home() {

  const [CardIniciado1, setCardIniciado1] = useState(false);
  const [CardIniciado2, setCardIniciado2] = useState(false);
  const [cardModal, setCardModal] = useState<number|null>(null);
  const [card1, setCard1] = useState(null);
  const [card2, setCard2] = useState(null);
  const [carregandoServico, setCarregandoServico] = useState(false);
  const [listaCartas, setListaCartas] = useState([]);
  const [energiaExistentes, setEnergiaExistentes] = useState<string[]>([]);
  const [treinadoresExistentes, setTreinadoresExistentes] = useState<string[]>([]);
  const [animacaoAtiva, setAnimacaoAtiva] = useState<number|null>(null);

  useEffect(() => {
    carregarListaDeCartas();
  }, []);

  // useEffect(() => {
  //   loop(listaCartas);
  // }, [listaCartas]);


  const trocarCard = (numCard:number) => {
    setAnimacaoAtiva(numCard);
    setTimeout(()=>{
      setAnimacaoAtiva(null);
      alterarCard(numCard);
    },1000)
  };

  const alterarCard = async (div:number) => {
    setCardModal(div)
  };

  const carregarCard = (card:any) => {
    if (card === null){
      setCardModal(null);
      return;
    }
    if (cardModal === 1) {
      setCardIniciado1(true);
      setCard1(card);
      setCardModal(null);
    }else if (cardModal === 2){
      setCardIniciado2(true);
      setCard2(card);
      setCardModal(null);
    }
  };

  const carregarListaDeCartas = async () => {
    setCarregandoServico(true);
    const retorno = await getAllCards();
    const listaCartasComImagem = retorno.filter((carta: any) => {
      const nome = carta.name?.trim();      
      return carta.image && nome && !CartasExcluidasSet.has(nome);
    })
    setListaCartas(listaCartasComImagem);
    setCarregandoServico(false);
  }

  const sortearCarta = () => {
    const randomIndex = Math.floor(Math.random() * listaCartas.length);
    const cartaSorteada:CardSimples = listaCartas[randomIndex];
    const cartaCompleta = getCardById(cartaSorteada.id);
    return cartaCompleta;
  }

  // const loop = async (lista: any) => {
  //   const energiasExistentes = new Set<string>();
  //   const treinadoresExistentes = new Set<string>();

  //   const promessas = lista.map(async (carta: any) => {
  //     const cartaCompleta = await getCardById(carta.id);
  //     if (!CartasExcluidasSet.has(carta.nome)) {
  //       if (cartaCompleta.category == "Treinador") {
  //         energiasExistentes.add(cartaCompleta.name);
  //         setEnergiaExistentes(Array.from(energiasExistentes));
  //       }else if(cartaCompleta.category == "Energia"){
  //         treinadoresExistentes.add(cartaCompleta.name);
  //         setTreinadoresExistentes(Array.from(treinadoresExistentes));
  //       }
  //     }
  //   });

  //   await Promise.all(promessas);
  // };



  return (
    <div className="grid grid-cols-5 2xl:grid-cols-7 gap-4">
      <ListaCardProvider lista={listaCartas}>
        {cardModal && 
        <ModalSelectCards carregarCard={carregarCard} />
        }
      </ListaCardProvider>
        <div className="col-span-5 2xl:col-span-7 py-5 h-auto max-h-[120px]">
          <Header page="duelo" />
        </div>
        <div className="col-span-3 col-start-2 2xl:col-start-3 row-start-2 flex justify-end items-center mt-7">
          <div className="grid w-full grid-cols-11 grid-rows-1">
            {CardIniciado1 && (
              <div className="col-span-5 row-start-1 flex justify-end items-center px-2">
                <div className="w-70 flex justify-center">
                  <button 
                  className="cursor-pointer justify-center w-[35px] h-[35px] flex"
                  onClick={()=>{trocarCard(1)}}
                  >
                      <Image
                      className={`absolute ${animacaoAtiva == 1 && 'alterar-card'}`}
                      src="/assets/img/refresh.png"
                      alt="refresh"
                      width={35}
                      height={35}
                      >
                      </Image>
                      <Image
                      className="absolute mt-[10px]"
                      src="/assets/img/pokeball-small.png"
                      alt="refresh"
                      width={15}
                      height={15}
                      ></Image>
                  </button>
                </div>
              </div>
            )}
            {CardIniciado2 && (
              <div className="col-span-5 row-start-1 col-start-6 flex justify-end items-center px-2">
                <div className="w-70 flex justify-center">
                  <button 
                  className="cursor-pointer justify-center w-[35px] h-[35px] flex"
                  onClick={()=>{trocarCard(2)}}
                  >
                      <Image
                      className={`absolute ${animacaoAtiva == 2 && 'alterar-card'}`}
                      src="/assets/img/refresh.png"
                      alt="refresh"
                      width={35}
                      height={35}
                      >
                      </Image>
                      <Image
                      className="absolute mt-[10px]"
                      src="/assets/img/pokeball-small.png"
                      alt="refresh"
                      width={15}
                      height={15}
                      ></Image>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-3 col-start-2 2xl:col-start-3 row-start-3 flex justify-end items-center">
          <div className="grid w-full grid-cols-11 grid-rows-1">
            <div className="col-span-5 row-start-1 flex justify-end items-center py-3 px-2">
              {!CardIniciado1 && (
                <div className="absolute w-70 justify-center text-center z-20">
                  <button
                    className={`${carregandoServico?'cursor-progress':'cursor-pointer'} inline-block rounded-sm bg-indigo-600 px-8 py-3 text-lg font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden`}
                    style={{ fontFamily: 'PokeFont' }}
                    onClick={() => setCardModal(1)}
                    disabled={carregandoServico}
                  >
                    {carregandoServico ? 'Carregando...' : 'Escolher'}
                  </button>
                </div>
              )}
              <div className="relative w-70">
                <div
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md transition-opacity duration-3500 ${
                    CardIniciado1 ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card1} numCard={1} abrirModal={alterarCard}/>
              </div>
            </div>
            <div className="col-span-1 row-start-1 flex justify-center items-center px-1">
              <Image
                src="/assets/img/versus.png"
                alt="versus"
                width={70}
                height={70}
                className="rounded object-cover"
              />
            </div>
            <div className="col-span-5 row-start-1 flex justify-start items-center py-3 px-2">
              {!CardIniciado2 && (
                <div className="absolute w-70 justify-center text-center z-20">
                  <button
                    className={`${carregandoServico?'cursor-progress':'cursor-pointer'} inline-block rounded-sm bg-indigo-600 px-8 py-3 text-lg font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden`}
                    style={{ fontFamily: 'PokeFont' }}
                    onClick={() => setCardModal(2)}
                  >
                    {carregandoServico ? 'Carregando...' : 'Escolher'}
                  </button>
                </div>
              )}
              <div className="relative w-70">
                <div
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md transition-opacity duration-3500 ${
                    CardIniciado2 ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card2} numCard={2} abrirModal={alterarCard}/>
              </div>
            </div>
          </div>
        </div>
        {CardIniciado1 && CardIniciado2 && (
          <div className="col-span-3 col-start-2 2xl:col-start-3 row-start-4 bg-painel flex justify-center items-center rounded-xl px-1 py-1">
            <div className="w-full">
                <PainelComparativo card1={card1} card2={card2} />
            </div>
          </div>
        )}
    </div>
  );
}
