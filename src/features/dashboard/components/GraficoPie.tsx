import { useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import TooltipCustom from './TooltipCustom';

export default function GraficoPie ({dados}: { dados: { name: string; value: number;}[] }) {    
    
    const COLORS = ["#8884d8","#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        // console.log("Dados recebidos para o gráfico de pie:", dados);
        
        if (!dados || dados.length === 0) {
            console.error("Dados inválidos para o gráfico de barras.");
        }
    }
    , [dados]);
    
    return (
        <PieChart width={500} height={300}>
            <Pie
                data={dados}
                innerRadius={60}
                outerRadius={105}
                fill="#8884d8"
                paddingAngle={3.2}
                dataKey="value"
            >
                {dados.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="false" />
                ))}
            </Pie>
            <Tooltip content={<TooltipCustom />}/>
        </PieChart>
    );
}