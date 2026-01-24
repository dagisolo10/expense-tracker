import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#ef4444"]; // Green, Red

export default function PieChartComp({ stats }) {
    const chartData = [
        { name: "Income", value: stats.stats.totalIncome || 0 },
        { name: "Expense", value: stats.stats.totalExpense || 0 },
    ];

    const totalBalance = stats.stats.totalBalance || 0;

    return (
        <div className="relative h-75 w-full">
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-gray-400 uppercase">Balance</span>
                <span className="text-2xl font-bold text-white">${totalBalance.toLocaleString()}</span>
            </div>
            <div className="h-full w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" paddingAngle={4} dataKey="value" isAnimationActive={true} stroke="none">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} className="cursor-pointer transition-all duration-300 outline-none hover:opacity-80" />
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
