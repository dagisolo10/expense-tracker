import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import utilStore from "../../store/util.store";

export default function Chart({ data, color }) {
    const { isInThisMonth } = utilStore();

    const oneMonthData = data.filter((d) => isInThisMonth(new Date(d.createdAt)));

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const baseData = Array.from({ length: today }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const label = date.toLocaleString("en-US", { month: "short", day: "numeric" });
        return { date: label, value: 0, rawDate: date };
    });

    const mergedData = oneMonthData
        .reduce(
            (acc, curr) => {
                const d = new Date(curr.createdAt);
                const dayIndex = d.getDate() - 1;
                if (acc[dayIndex]) acc[dayIndex].value += curr.amount;
                return acc;
            },
            [...baseData],
        )
        .sort((a, b) => a.rawDate - b.rawDate);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={mergedData}>
                    <defs>
                        <linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.7} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="none" />
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1e1e2f",
                            border: "none",
                            borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#ccc" }}
                        itemStyle={{ color }}
                    />
                    <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#fadeDown)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
