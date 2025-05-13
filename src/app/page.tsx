'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import Card from "../components/card";
import PainelComparativo from "../components/painelComparativo";
import { getAllCards, getCardById } from "../services/tcgdexService";

interface CardSimples {
  id: string;
  name: string;
  localId: string;
  image?: string;
}

export default function Home() {

  const [CardIniciado1, setCardIniciado1] = useState(false);
  const [CardIniciado2, setCardIniciado2] = useState(false);
  const [card1, setCard1] = useState(null);
  const [card2, setCard2] = useState(null);
  const [carregandoServico, setCarregandoServico] = useState(false);
  const [listaCartas, setListaCartas] = useState([]);
  const [raridadesExistentes, setRaridadesExistentes] = useState<string[]>([]);

  useEffect(() => {
    carregarListaDeCartas();
  }, []);

  // useEffect(() => {
  //   loopRaridade(listaCartas);
  // }, [listaCartas]);

  const iniciarCard = async (div:number) => {
    setCarregandoServico(true);
    await carregarCard(div);
    if (div === 1) {
      setCardIniciado1(true);
      setCarregandoServico(false);
      return;
    }
    setCardIniciado2(true);
    setCarregandoServico(false);
  };

  const carregarCard = async (div:number) => {
    let categoriaPokemon = false;
    let card = null;
    while (categoriaPokemon === false) {
      card = await sortearCarta();
      if (card.category && card.category == "Pokemon") {
        categoriaPokemon = true;
        break;
      }
    }
    console.log(card);
    if (div === 1) {
      setCard1(card);
      return;
    } 
    setCard2(card);
  };

  const carregarListaDeCartas = async () => {
    setCarregandoServico(true);
    const retorno = await getAllCards();
    const listaCartasComImagem = retorno.filter((carta: any) => {
      return carta.image && carta.image !== "";
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

  const loopRaridade = async (lista: any) => {
    const raridadesExistentes = new Set<string>();

    const promessas = lista.map(async (carta: any) => {
      const cartaCompleta = await getCardById(carta.id);
      if (cartaCompleta.rarity && cartaCompleta.category == "Pokemon") {
        raridadesExistentes.add(cartaCompleta.rarity);
        setRaridadesExistentes(Array.from(raridadesExistentes));
      }
    });

    await Promise.all(promessas);
  };



  return (
    <div className="grid grid-cols-5 2xl:grid-cols-7 gap-4">
        <div className="col-span-5 2xl:col-span-7 py-5 h-auto max-h-[120px]">
          <div className="flex justify-center items-center gap-4">
            <Image
              src="/assets/img/logo.png"
              alt="pokeduel"
              width={60}
              height={60}
              className="rounded object-cover"
            />
            <h3 className="font-medium text-[40px]" style={{ fontFamily: 'PokeFont' }}>Poke<span className="text-[#EC003F]">Duel</span></h3>
          </div>
        </div>
        <div className="col-span-3 col-start-2 2xl:col-start-3 row-start-2 flex justify-end items-center">
          <div className="grid w-full grid-cols-11 grid-rows-1">
            <div className="col-span-5 row-start-1 flex justify-end items-center py-3 px-2">
              {!CardIniciado1 && (
                <div className="absolute w-70 justify-center text-center z-20">
                  <button
                    className={`${carregandoServico?'cursor-progress':'cursor-pointer'} inline-block rounded-sm bg-indigo-600 px-8 py-3 text-lg font-medium text-white transition hover:scale-110 hover:-rotate-2 focus:ring-3 focus:outline-hidden`}
                    style={{ fontFamily: 'PokeFont' }}
                    onClick={() => iniciarCard(1)}
                    disabled={carregandoServico}
                  >
                    {carregandoServico ? 'Carregando...' : 'Iniciar'}
                  </button>
                </div>
              )}
              <div className="relative w-70">
                <div
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md transition-opacity duration-1500 ${
                    CardIniciado1 ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card1} numCard={1} />
              </div>
            </div>
            <div className="col-span-1 row-start-1 flex justify-center items-center">
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
                    onClick={() => iniciarCard(2)}
                  >
                    {carregandoServico ? 'Carregando...' : 'Iniciar'}
                  </button>
                </div>
              )}
              <div className="relative w-70">
                <div
                  className={`absolute inset-0 z-10 bg-gray-800 rounded-md transition-opacity duration-1500 ${
                    CardIniciado2 ? 'opacity-0' : 'opacity-100'
                  }`}
                ></div>
                <Card card={card2} numCard={2}/>
              </div>
            </div>
          </div>
        </div>
        {CardIniciado1 && CardIniciado2 && (
          <div className="col-span-3 col-start-2 2xl:col-start-3 row-start-3 bg-yellow-500 flex justify-center items-center rounded-xl px-1 py-1">
            <div className="w-full">
                <PainelComparativo card1={card1} card2={card2} />
            </div>
          </div>
        )}
    </div>
  );
}
