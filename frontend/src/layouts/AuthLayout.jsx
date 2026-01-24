import { CartesianGrid, Legend, BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { Outlet } from "react-router";
import utilStore from "../store/util.store";
import { useEffect, useState } from "react";

export default function AuthLayout() {
    const { randAmount } = utilStore();
    const COLORS = ["darkslateblue", "darkcyan"];
    const [chartData, setChartData] = useState([]);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const generateData = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(year, month, i + 1);
            const label = date.toLocaleString("en-US", { weekday: "short" });
            return { date: label, income: randAmount(), expense: randAmount(), rawDate: date };
        });
    };

    useEffect(() => {
        setChartData(generateData());

        const interval = setInterval(() => {
            setChartData(generateData());
        }, 2000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="grid h-screen grid-cols-2 gap-8 bg-black p-8">
            <Outlet />
            {window.innerWidth >= 1024 && (
                <div className="pointer-events-none invisible h-3/4 w-full items-center justify-center self-center lg:visible lg:flex">
                    <ResponsiveContainer minWidth={0} minHeight={0}>
                        <BarChart data={chartData}>
                            <CartesianGrid stroke="#374151" strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Bar dataKey="income" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[0]} />
                                ))}
                            </Bar>
                            <Bar dataKey="expense" fill={COLORS[1]} radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[1]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
