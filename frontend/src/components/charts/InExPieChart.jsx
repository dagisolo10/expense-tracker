import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

const generateColor = () => {
    let color = "#";
    for (let index = 0; index < 6; index++) {
        color += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return color;
};

export default function InExPieChart({ stats, total }) {
    const chartData = useMemo(() => {
        const grouped = stats.reduce((acc, curr) => {
            const name = curr?.category?.name || "Other";
            if (!acc[name]) acc[name] = 0;
            acc[name] += curr.amount;
            return acc;
        }, {});

        return Object.keys(grouped).map((name) => ({ name, value: grouped[name], color: generateColor() }));
    }, [stats]);

    const totalAmount = total || 0;

    if (!total) return;

    return (
        <div className="relative h-75 w-full">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-gray-400 uppercase">{stats[0]?.type}</span>
                <span className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</span>
            </div>
            <div className="h-80">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" paddingAngle={4} dataKey="value" isAnimationActive={true} stroke="none">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer transition-all duration-300 outline-none hover:opacity-80" />
                            ))}
                        </Pie>

                        <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
                        <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
