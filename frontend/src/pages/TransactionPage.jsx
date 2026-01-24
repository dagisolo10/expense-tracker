import { Download, Plus, Trash2, Edit, ReceiptText, TrendingUpDown } from "lucide-react";
import useTransactionStore from "../store/useTransactionStore";
import { useEffect } from "react";
import utilStore from "../store/util.store";
import BarGraph from "../components/charts/BarGraph";

export default function TransactionPage() {
    const { transactions, deleteTransaction, setTrxToUpdate } = useTransactionStore();
    const { toggleModal } = utilStore();

    const handleDelete = (id) => window.confirm("Are your sure your want to delete this transaction?") && deleteTransaction(id);
    const handleUpdate = (id) => {
        const transaction = transactions.find((trx) => trx._id === id);
        setTrxToUpdate(transaction);
        toggleModal();
    };

    useEffect(() => document.querySelector("main") && document.querySelector("main").scrollTo({ top: 0, behavior: "smooth" }), []);

    return (
        <div className="scrollbar-none bg-container flex-1 space-y-4 overflow-y-auto p-4 xl:rounded-xl">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-h text-xl font-semibold tracking-wider">This Week Transactions</h1>
                    <p className="text-accent text-sm">Review your financial activity and income performance</p>
                </div>
                {transactions.length > 0 && (
                    <button onClick={toggleModal} className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                        <Plus className="size-4" />
                        <span>Add Transaction</span>
                    </button>
                )}
            </div>
            {!transactions.length && (
                <div className="border-card/50 from-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl bg-linear-to-b p-6 text-center">
                    <div className="bg-accent/20 mb-4 rounded-full p-4">
                        <ReceiptText className="size-10 text-base" />
                    </div>
                    <h3 className="text-h text-2xl font-semibold">No transactions made yet!</h3>
                    <p className="text-accent mt-2 mb-6 text-sm">Start tracking your spending and earning trends by creating your first transaction.</p>
                    <button onClick={toggleModal} className="bg-card hover:bg-hover text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 duration-300">
                        <Plus className="size-4" />
                        New Transaction
                    </button>
                </div>
            )}
            {transactions.length > 0 && (
                <div className="space-y-8">
                    <BarGraph data={transactions} />
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-h text-xl font-semibold tracking-wider">All Transactions</h1>
                            <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                                <Download className="size-4" />
                                <span className="text-sm">Download</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 gap-x-8 px-4 sm:grid-cols-2">
                            {transactions.map((transaction) => (
                                <div key={transaction._id} className="border-b-card group flex flex-col items-start gap-2 border-b pb-4">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-h text-sm md:text-lg">{transaction.category.name}</h2>
                                            <p className="text-accent text-sm">{transaction.description}</p>
                                        </div>
                                        <div className="text-h rounded-full bg-slate-800 p-2">{transaction.category.icon}</div>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p className={`text-sm ${transaction.type === "income" ? " text-green-600" : " text-red-700"}`}>${transaction.amount?.toFixed(2)}</p>
                                        <p className="text-base text-xs">{new Date(transaction.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex w-full items-center gap-4">
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleUpdate(transaction._id)}>
                                            <Edit className="size-4" />
                                        </button>
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleDelete(transaction._id)}>
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
