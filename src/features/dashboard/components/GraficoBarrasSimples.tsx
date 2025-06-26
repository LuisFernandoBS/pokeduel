import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import TooltipCustom from './TooltipCustom';


export default function GraficoBarrasSimples ({dados}: { dados: { tipo: string; quantidade: number;}[] }) {    
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
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip content={<TooltipCustom />}/>
                <Bar dataKey="quantidade" fill="#8884d8" activeBar={false} />
            </BarChart>
      </ResponsiveContainer>
    )
}