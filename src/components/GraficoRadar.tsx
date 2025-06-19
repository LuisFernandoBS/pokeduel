import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function GraficoRadar ({dados}: { dados: any[] }) {    
    
    const COLORS = ["#8884d8","#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const[listaNomes, setListaNomes] = useState<string[]>([]);
    const[limiteGrafico, setLimiteGrafico] = useState<number>(50);

    const capturaDinamicaDosNomes = (obj: any) => {
        let lista:string[] = [];
        Object.keys(obj).forEach(key => {
            if (key !== 'subject' && key !== 'fullMark') {
                lista.push(key);
            }
        });
        return lista;
    };

    useEffect(() => {
        console.log("Dados recebidos para o gráfico de radar:", dados);
        
        if (!dados || dados.length === 0) {
            console.error("Dados inválidos para o gráfico de barras.");
            return;
        }
        setListaNomes(capturaDinamicaDosNomes(dados[0]));
        setLimiteGrafico(dados[0].fullMark);
    }
    , [dados]);
    
    return (
        <RadarChart outerRadius={130} width={500} height={500} data={dados}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={45} domain={[0, limiteGrafico]} />
            {
                listaNomes.map((nome, index) => (
                    <Radar
                        key={index}
                        name={nome}
                        dataKey={nome}
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                    />
                ))
            }
            <Legend />
        </RadarChart>
    );
}