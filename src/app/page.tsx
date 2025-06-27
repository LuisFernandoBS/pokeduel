'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import Header from "../components/Header";
import Card from "../components/Card";
import ModalSelectCards from "../components/ModalSelectCards";
import PainelComparativo from "../components/PainelComparativo";
import { getAllCards, getCardById } from "../services/tcgdexService";
import { ListaCardProvider } from "../contexts/ListaCardsContext";
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
  const [cardVencedor, setCardVencedor] = useState<number|null>(null);

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

  const deletaCard = (numCard:number) => {
    if (numCard === 1) {
      setCardIniciado1(false);
      setCard1(null);
    } else if (numCard === 2) {
      setCardIniciado2(false);
      setCard2(null);
    }
    setCardModal(null);
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
    <div className="grid grid-cols-1 md:grid-cols-12 2xl:grid-cols-7 gap-4">
      <ListaCardProvider lista={listaCartas}>
        {cardModal && 
        <ModalSelectCards carregarCard={carregarCard} />
        }
      </ListaCardProvider>
        <div className="col-span-1 md:col-start-2 md:col-span-10 2xl:col-span-7 py-5 h-auto max-h-[120px]">
          <Header page="duelo" />
        </div>
        <div className="col-span-1 md:col-start-2 md:col-span-10 2xl:col-span-5 2xl:col-start-2 row-start-2 flex justify-end items-center mt-7">
          <div className="grid w-full grid-cols-11 grid-rows-1">
            {CardIniciado1 && (
              <div className="col-span-11 sm:col-span-5 row-start-1 flex justify-end items-center px-2 pt-5 sm:pt-0">
                <div className="w-full sm:w-70 flex justify-center">
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
                  <button 
                  className="cursor-pointer justify-center w-[35px] h-[35px] ml-5 flex"
                  onClick={()=>{deletaCard(1)}}
                  >
                      <Image
                      className={`absolute`}
                      src="/assets/img/delete.png"
                      alt="refresh"
                      width={35}
                      height={35}
                      >
                      </Image>
                  </button>
                </div>
              </div>
            )}
            {CardIniciado2 && (
              <div className="hidden sm:flex col-span-5 row-start-1 col-start-7 2xl:justify-start md:justify-center items-center px-2">
                <div className="md:w-100 2xl:w-70 flex justify-center">
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
                  <button 
                  className="cursor-pointer justify-center w-[35px] h-[35px] ml-5 flex"
                  onClick={()=>{deletaCard(2)}}
                  >
                      <Image
                      className={`absolute`}
                      src="/assets/img/delete.png"
                      alt="refresh"
                      width={35}
                      height={35}
                      >
                      </Image>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-1 md:col-start-2 md:col-span-10 2xl:col-span-5 2xl:col-start-2 row-start-3 flex justify-end items-center pb-5 md:pb-0">
          <div className="grid w-full grid-cols-1 md:grid-cols-11 grid-rows-1">
            <div className={`col-span-1 md:col-span-5 md:row-start-1 flex justify-center md:justify-end py-3 px-2 ${CardIniciado1?'items-start':'items-center'}`} >
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
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md  ${
                    CardIniciado1 ? 'transition-opacity duration-3500 opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card1} numCard={1} cardVencedor={cardVencedor}/>
              </div>
            </div>
            <div className="col-span-1 md:row-start-1 py-3 md:py-0 flex justify-center items-center px-1">
              <Image
                src="/assets/img/versus.png"
                alt="versus"
                width={70}
                height={70}
                className="rounded object-cover"
              />
            </div>
            <div className={`col-span-1 md:col-span-5 md:row-start-1 flex justify-center md:justify-start py-3 px-2 ${CardIniciado2?'items-start':'items-center'}`}>
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
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md  ${
                    CardIniciado2 ? 'transition-opacity duration-3500 opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card2} numCard={2} cardVencedor={cardVencedor}/>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden col-span-1 flex justify-center items-center mt-1 mb-3">
          {CardIniciado2 && (
            <div className="w-100 flex justify-center">
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
              <button 
              className="cursor-pointer justify-center w-[35px] h-[35px] ml-5 flex"
              onClick={()=>{deletaCard(2)}}
              >
                  <Image
                  className={`absolute`}
                  src="/assets/img/delete.png"
                  alt="refresh"
                  width={35}
                  height={35}
                  >
                  </Image>
              </button>
            </div>
          )}
        </div>
        {CardIniciado1 && CardIniciado2 && (
          <div className="col-span-1 md:col-start-2 md:col-span-10 2xl:col-span-5 2xl:col-start-2 sm:row-start-4 bg-painel flex justify-center items-center rounded-xl px-1 py-1 mb-5 mx-3 sm:mb-0 sm:mx-0">
            <div className="w-full">
                <PainelComparativo card1={card1} card2={card2} salvarCardVencedor={setCardVencedor} />
            </div>
          </div>
        )}
    </div>
  );
}
