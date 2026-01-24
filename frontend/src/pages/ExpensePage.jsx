import { Download, Plus, Trash2, Edit, TrendingDown } from "lucide-react";
import useTransactionStore from "../store/useTransactionStore";
import { useEffect } from "react";
import utilStore from "../store/util.store";
import Chart from "../components/charts/LineChart";

export default function ExpensePage() {
    const { getExpenses, deleteTransaction, setTrxToUpdate } = useTransactionStore();
    const { toggleModal } = utilStore();

    const expenseList = getExpenses();

    const handleDelete = (id) => window.confirm("Are your sure your want to delete this transaction?") && deleteTransaction(id);

    const handleUpdate = (id) => {
        const transaction = expenseList.find((trx) => trx._id === id);
        setTrxToUpdate(transaction);
        toggleModal();
    };

    useEffect(() => {
        const mainContainer = document.querySelector("main");
        if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="scrollbar-none bg-container flex-1 space-y-4 overflow-y-auto p-4 xl:rounded-xl">
            <div className="space-y-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-h text-xl font-semibold tracking-wider">This Month Expense Overview</h1>
                        <p className="text-accent text-sm">Track your spending trends over time and gain insight into where your money goes</p>
                    </div>
                    {expenseList.length > 0 && (
                        <button onClick={toggleModal} className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                            <Plus className="size-4" />
                            <span>Add Expense</span>
                        </button>
                    )}
                </div>
            </div>
            {!expenseList.length && (
                <div className="border-card/50 from-card mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl bg-linear-to-b p-6 text-center">
                    <div className="mb-4 rounded-full bg-red-500/20 p-4">
                        <TrendingDown className="size-10 text-red-500" />
                    </div>
                    <h1 className="text-h mb-1 text-2xl font-semibold">No expense made yet</h1>
                    <p className="text-accent mb-4 text-sm">Make your first expense transaction.</p>
                    <button onClick={toggleModal} className="bg-card hover:bg-hover text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 duration-300">
                        <Plus className="size-4" />
                        <span>Add Expense</span>
                    </button>
                </div>
            )}
            {expenseList.length > 0 && (
                <div className="space-y-8">
                    <Chart data={expenseList} color={`red`} />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-h text-xl font-semibold tracking-wider">All Expenses</h1>
                            <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 duration-300">
                                <Download className="size-4" />
                                <span className="text-sm">Download</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
                            {expenseList.map((expense) => (
                                <div key={expense._id} className="border-b-card group flex flex-col items-start gap-2 border-b pb-4">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-h text-sm">{expense.category.name}</h2>
                                            <p className="text-accent text-sm">{expense.description}</p>
                                        </div>
                                        <div className="text-h rounded-full bg-slate-800 p-2">{expense.category.icon}</div>
                                    </div>
                                    <div className="flex w-full items-center justify-between">
                                        <p className={`text-sm ${expense.type === "income" ? " text-green-600" : " text-red-700"}`}>${expense.amount?.toFixed(2)}</p>
                                        <p className="text-base text-xs">{new Date(expense.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex w-full items-center gap-4">
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleUpdate(expense._id)}>
                                            <Edit className="size-4" />
                                        </button>
                                        <button className="text-accent hover:text-h cursor-pointer duration-500 group-hover:opacity-100 sm:opacity-0" onClick={() => handleDelete(expense._id)}>
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
