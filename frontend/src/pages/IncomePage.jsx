import { Download, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
import useTransactionStore from "../store/useTransactionStore";
import { useEffect } from "react";
import utilStore from "../store/util.store";
import Chart from "../components/charts/LineChart";

export default function IncomePage() {
    const { getIncomes, deleteTransaction, setTrxToUpdate } = useTransactionStore();
    const { toggleModal } = utilStore();
    const incomeList = getIncomes();

    const handleDelete = (id) => window.confirm("Are your sure your want to delete this transaction?") && deleteTransaction(id);

    const handleUpdate = (id) => {
        const transaction = incomeList.find((trx) => trx._id === id);
        setTrxToUpdate(transaction);
        toggleModal();
    };

    useEffect(() => document.querySelector("main") && document.querySelector("main").scrollTo({ top: 0, behavior: "smooth" }), []);

    return (
        <div className="scrollbar-none bg-container flex-1 space-y-4 overflow-y-auto p-4 xl:rounded-xl">
            <div className="space-y-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-h text-xl font-semibold tracking-wider">This Month Income Overview</h1>
                        <p className="text-accent text-sm">Track your earnings over time and analyze your income trends</p>
                    </div>
                    {incomeList.length > 0 && (
                        <button onClick={toggleModal} className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                            <Plus className="size-4" />
                            <span>Add Income</span>
                        </button>
                    )}
                </div>
            </div>
            {!incomeList.length && (
                <div className="border-card/50 from-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl bg-linear-to-b p-6 text-center">
                    <div className="mb-4 rounded-full bg-green-500/20 p-4">
                        <TrendingUp className="size-10 text-green-500" />
                    </div>
                    <h1 className="text-h mb-1 text-2xl font-semibold">No income made yet</h1>
                    <p className="text-accent mb-4 text-sm">Make your first income transaction.</p>
                    <button onClick={toggleModal} className="bg-card hover:bg-hover text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 duration-300">
                        <Plus className="size-4" />
                        <span>Add Income</span>
                    </button>
                </div>
            )}
            {incomeList.length > 0 && (
                <div className="space-y-8">
                    <Chart data={incomeList} color={`green`} />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-h text-xl font-semibold tracking-wider">Income Sources</h1>
                            <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                                <Download className="size-4" />
                                <span className="text-sm">Download</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
                            {incomeList.map((income) => (
                                <div key={income._id} className="border-b-card group flex flex-col items-start gap-2 border-b pb-4">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-h text-sm">{income.category.name}</h2>
                                            <p className="text-accent text-sm">{income.description}</p>
                                        </div>
                                        <div className="text-h rounded-full bg-slate-800 p-2">{income.category.icon}</div>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p className={`text-sm ${income.type === "income" ? " text-green-600" : " text-red-700"}`}>${income.amount?.toFixed(2)}</p>
                                        <p className="text-base text-xs">{new Date(income.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex w-full items-center gap-4">
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleUpdate(income._id)}>
                                            <Edit className="size-4" />
                                        </button>
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleDelete(income._id)}>
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
