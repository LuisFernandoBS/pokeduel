import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import TooltipCustom from './TooltipCustom';


export default function GraficoBarrasDuplas ({dados}: { dados: { nomeCard: string; hp: number; ataque:number}[] }) {    
    useEffect(() => {
        // console.log("Dados recebidos para o gráfico de barras:", dados);
        
        if (!dados || dados.length === 0) {
            console.error("Dados inválidos para o gráfico de barras.");
        }
    }
    , [dados]);
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={dados}
            layout='vertical'
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <XAxis type="number" />
                <YAxis dataKey="nomeCard" type="category" />
                <Tooltip content={<TooltipCustom />}/>
                <Bar dataKey="hp" fill="#8884d8" activeBar={false} />
                <Bar dataKey="ataque" fill="#0088FE" activeBar={false} />
            </BarChart>
      </ResponsiveContainer>
    )
}