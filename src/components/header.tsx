import Image from "next/image";
import { useRouter } from 'next/navigation';


export default function Header({page}: { page: string }) {
  const router = useRouter();

    
return (
    <div className="w-full">
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
        <div className="flex justify-center items-center mt-8">
            <span
            className="inline-flex divide-x overflow-hidden rounded border shadow-sm divide-gray-600 border-gray-600 bg-gray-700"
            >
                <button
                    type="button"
                    className={`${page !== 'duelo' && 'bg-gray-800 cursor-pointer hover:bg-gray-900'} px-3 py-1.5 text-sm font-medium transition-colors focus:relative text-gray-200 hover:text-white`}
                    disabled={page === 'duelo'}
                    onClick={() => router.push('/')}
                >
                    Duelo
                </button>

                <button
                    type="button"
                    className={`${page !== 'historico' && 'bg-gray-800 cursor-pointer hover:bg-gray-900'} $ px-3 py-1.5 text-sm font-medium transition-colors focus:relative text-gray-200 hover:text-white`}
                    disabled={page === 'historico'}
                    onClick={() => router.push('/historico')}
                >
                    Histórico
                </button>
            </span>
        </div>
    </div>
)
}