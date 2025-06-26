import { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function GraficoRadar ({dados}: { dados: any[] }) {    
    
    const COLORS = ["#8884d8","#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const[listaNomes, setListaNomes] = useState<string[]>([]);
    const[limiteGrafico, setLimiteGrafico] = useState<number>(50);

    const isMobile = window.innerWidth < 640;

    const larguraGrafico = isMobile ? 300 : 500;
    const alturaGrafico = isMobile ? 200 : 500;

    const gerarCorHSL = (index: number) => {
        const hue = (index * 360 / listaNomes.length) % 360;
        return `hsl(${hue}, 70%, 50%)`;
    };

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
        // console.log("Dados recebidos para o gráfico de radar:", dados);
        
        if (!dados || dados.length === 0) {
            console.error("Dados inválidos para o gráfico de barras.");
            return;
        }
        setListaNomes(capturaDinamicaDosNomes(dados[0]));
        setLimiteGrafico(dados[0].fullMark);
    }
    , [dados]);
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={130} width={larguraGrafico} height={alturaGrafico} data={dados}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={45} domain={[0, limiteGrafico]} />
                {
                    listaNomes.map((nome, index) => (
                        <Radar
                            key={index}
                            name={nome}
                            dataKey={nome}
                            stroke={gerarCorHSL(index)}
                            fill={gerarCorHSL(index)}
                            fillOpacity={0.6}
                        />
                    ))
                }
                <Legend />
                <Tooltip/>
            </RadarChart>
        </ResponsiveContainer>
    );
}