export default function BalanceCard({ label, value }) {
    const formatted = value?.toLocaleString("en-US", { style: "currency", currency: "USD" });

    const colorMap = {
        "Total Income": "text-green-600",
        "Total Expense": "text-red-600",
        "Total Balance": "text-h",
    };
    return (
        <div className="bg-card space-y-1 rounded-md px-4 py-2">
            <p className="text-accent text-sm">{label}</p>
            <h1 className={`text-xl ${colorMap[label]}`}>{formatted}</h1>
        </div>
    );
}
5;
