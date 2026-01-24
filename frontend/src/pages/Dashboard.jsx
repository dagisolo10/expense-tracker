import BalanceCard from "../components/BalanceCard";
import { useEffect } from "react";
import useTransactionStore from "../store/useTransactionStore";
import RecentList from "../components/RecentList";
import { Plus, ReceiptText } from "lucide-react";
import utilStore from "../store/util.store";
import StatsPieChart from "../components/charts/StatsPieChart";
import LoadingPage from "../components/LoadingPage";
import InExPieChart from "../components/charts/InExPieChart";

export default function Dashboard() {
    const { stats, getStats, getTransactions, transactions, isLoading } = useTransactionStore();
    const { toggleModal } = utilStore();

    useEffect(() => {
        Promise.all([getStats(), getTransactions()]);
    }, [getStats, getTransactions]);

    useEffect(() => document.querySelector("main") && document.querySelector("main").scrollTo({ top: 0, behavior: "smooth" }), []);

    if (isLoading) return <LoadingPage />;

    const income = transactions?.filter((tran) => tran.type === "income").slice(0, 5);
    const expense = transactions?.filter((tran) => tran.type === "expense").slice(0, 5);
    const recentTransactions = transactions?.slice(0, 5);

    return (
        <div className="scrollbar-none bg-container flex-1 space-y-4 overflow-y-auto p-4 xl:rounded-xl">
            <h2 className="text-h text-2xl font-bold">Dashboard</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <BalanceCard label="Total Balance" value={stats?.stats.totalBalance} />
                <BalanceCard label="Total Income" value={stats?.stats.totalIncome} />
                <BalanceCard label="Total Expense" value={stats?.stats.totalExpense} />
            </div>
            {!transactions.length && (
                <div className="border-card/50 from-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl bg-linear-to-b p-6 text-center">
                    <div className="bg-accent/20 mb-4 rounded-full p-4">
                        <ReceiptText className="size-10 text-base" />
                    </div>
                    <h3 className="text-h text-xl font-semibold">Clean slate!</h3>
                    <p className="text-accent mt-2 mb-6 max-w-xs text-sm">It looks like you haven't added any transactions. Keep track of your spending effortlessly.</p>
                    <button onClick={toggleModal} className="bg-card hover:bg-hover text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 duration-300">
                        <Plus className="size-4" />
                        New Transaction
                    </button>
                </div>
            )}
            {transactions.length > 0 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <RecentList to="/transaction" label={`Recent Transactions`} list={recentTransactions} />
                    <StatsPieChart stats={stats} />

                    <RecentList to={`/expense`} label={`Expense`} color={`text-red-600`} list={expense} />
                    <InExPieChart stats={expense} total={stats?.stats.totalExpense} />

                    <RecentList to={`/income`} label={`Income`} color={`text-green-600`} list={income} />
                    <InExPieChart stats={income} total={stats?.stats.totalIncome} />
                </div>
            )}
        </div>
    );
}
