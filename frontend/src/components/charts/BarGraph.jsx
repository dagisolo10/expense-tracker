import { CartesianGrid, Legend, BarChart, Bar, Tooltip, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import utilStore from "../../store/util.store";

export default function BarGraph({ data }) {
    const COLORS = ["#10b981", "#ef4444"];
    const { isInThisWeek, getWeekExtremes } = utilStore();
    const { weekStart } = getWeekExtremes();
    const oneWeekData = data.filter((trx) => isInThisWeek(new Date(trx.createdAt)));

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const baseData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(year, month, weekStart.getDate() + i);
        const label = date.toLocaleString("en-US", { month: "short", day: "numeric", weekday: "short" });
        return { date: label, income: 0, expense: 0, rawDate: date };
    });

    const mergedData = oneWeekData
        .reduce(
            (acc, curr) => {
                const d = new Date(curr.createdAt);
                const dayIndex = Math.floor((d - weekStart) / (1000 * 60 * 60 * 24));
                if (acc[dayIndex]) acc[dayIndex][curr.type] += curr.amount;
                return acc;
            },
            [...baseData],
        )
        .sort((a, b) => a.rawDate - b.rawDate);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <BarChart data={mergedData}>
                    <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.1)" }} contentStyle={{ backgroundColor: "hsl(220, 40%, 22%)", color: "#eee", border: "none", borderRadius: "8px" }} />
                    <Legend align="center" iconType="circle" iconSize={8} />

                    <Bar dataKey="income" fill={COLORS[0]} radius={[4, 4, 0, 0]}>
                        {mergedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[0]} />
                        ))}
                    </Bar>

                    <Bar dataKey="expense" fill={COLORS[1]} radius={[4, 4, 0, 0]}>
                        {mergedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[1]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
