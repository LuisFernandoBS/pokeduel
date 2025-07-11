interface Props {
  card:any,
  numCard:number,
  cardVencedor:number|null
}

export default function Card({ card, numCard, cardVencedor }: Props) {

  const cardImagem = card?.image;
  const cardNome = card?.name || "Nome da carta";
  const cardTipo = card?.types?.[0] || "Tipo da carta";
  const cardHp = card?.hp || "HP da carta";
  const cardRaridade = card?.rarity || "Raridade da carta";

  return (
    <article
    className={`overflow-hidden border ${numCard == 1 ? "border-blue-500":"border-red-700"} rounded-2xl shadow-[0_0_30px] ${numCard == 1 ? "shadow-blue-500/80":"shadow-red-700/80"} transition`}
    >
        {cardImagem ? (
          <img
              alt={card.name || 'Imagem da carta'}
              src={`${cardImagem ??'https://assets.tcgdex.net/pt/swsh/swsh8/86'}/high.webp`}
              className="h-96 w-70 object-cover"
          />
        ):(
          <div className="h-96 w-70 bg-gray-300 animate-pulse"></div>
        )}

        <div className="bg-gray-900 p-4 sm:p-6 ">
            <a href="#" className="flex">
              <h3 
              className={`mt-0.5 text-lg align-middle ${cardVencedor == numCard?'text-yellow-500':'text-white'}`}
              style={cardVencedor == numCard ? { textShadow: '0 0 3px #eab308' } : {}}
              >
                {cardNome} {cardVencedor == numCard? "- 👑	Vencedor 👑	" : ""}
              </h3>
            </a>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 mt-5">
                <div className="col-span-1 flex justify-center items-center text-center">
                    <span
                      className="inline-flex items-center justify-center rounded-full border border-red-500 px-2.5 py-0.5 w-full"
                    >
                      <p className="text-sm whitespace-nowrap text-red-500">HP: {cardHp}</p>
                    </span>
                </div>
                <div className="col-span-1 flex justify-center items-center text-center">
                    <span
                      className="inline-flex items-center justify-center rounded-full border border-blue-900 px-2.5 py-0.5 w-full"
                    >
                      <p className="text-sm whitespace-nowrap text-border-blue-900">{cardTipo}</p>
                    </span>
                </div>
                <div className={`col-span-${cardRaridade.length >= 8 ? '3':'1'} flex justify-center items-center text-center`}>
                    <span
                      className="inline-flex items-center justify-center rounded-full border border-yellow-500 px-2.5 py-0.5 w-full"
                    >
                      <p className="text-sm whitespace-nowrap text-yellow-500">{cardRaridade}</p>
                    </span>
                </div>
            </div>
        </div>
    </article>
  );
}
