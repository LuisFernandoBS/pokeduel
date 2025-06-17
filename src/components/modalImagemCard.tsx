import { useState } from "react";
import Image from "next/image";

interface Props {
    urlImagem:string
    fecharImagem:(url:string) => void;
}

export default function ModalImagemCard({urlImagem,fecharImagem}:Props) {
    const [imgCarregada, setImgCarregada] = useState(false);


    return(
        <div
        className="fixed inset-0 z-50 grid place-content-center bg-black/90 p-4"
        role="dialog"
        id="modalImagemCard"
        aria-modal="true"
        aria-labelledby="ModalImagemCard"
        >
            <div className="flex flex-col w-full max-w-md min-w-[440px] h-[700px] justify-center text-center items-center rounded-lg p-6 shadow-lg">
                <div className="w-full">
                    <button
                            type="button"
                            className="-me-4 -mt-4 cursor-pointer rounded-full p-2 transition-colors bg-gray-500 mb-6 focus:outline-none text-gray-300 hover:bg-gray-800 hover:text-gray-300"
                            aria-label="Close"
                            onClick={()=>{fecharImagem("")}}
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
                {!imgCarregada && (
                    <div className="inset-0 bg-gray-600 animate-pulse rounded-2xl w-[420px] h-[600px]" />
                )}
                <Image
                src={`${urlImagem}/high.webp`}
                alt="card"
                width={420}
                height={600}
                loading="eager"
                className={`object-cover rounded-2xl transition hover:scale-[105%] ${imgCarregada ? '' : 'hidden'}`}
                onLoad={() => {
                    setImgCarregada(true);
                }}
                />
            </div>
        </div>
    )
}