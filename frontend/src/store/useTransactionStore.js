import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const useTransactionStore = create((set, get) => ({
    transactions: [],
    stats: { stats: { totalBalance: 0, totalIncome: 0, totalExpense: 0 } },
    categoryStats: [],
    isLoading: false,
    trxToUpdate: null,

    setTrxToUpdate: (data) => set({ trxToUpdate: data }),

    addTransaction: async (data) => {
        const res = await toast.promise(api.post("/transactions", data), {
            loading: "Creating transaction",
            success: "Transaction added successfully 🎉",
            error: (error) => error?.response?.data?.error || "Failed to add transaction",
        });

        const newTrx = res.data;
        const { transactions } = get();
        const updatedList = transactions.map((trx) => (trx.category.name === newTrx.category.name ? { ...trx, category: { ...trx.category, icon: newTrx.category.icon } } : trx));

        set({ transactions: [newTrx, ...updatedList] });
    },

    updateTransaction: async (id, data) => {
        const res = await toast.promise(api.patch(`/transactions/${id}`, data), {
            loading: "Updating transaction",
            success: "Transaction updated 🎉",
            error: (error) => error?.response?.data?.error || "Failed to update transaction",
        });
        const updatedTrx = res.data;
        const { transactions } = get();

        set({ transactions: transactions.map((oldTrx) => (oldTrx._id === updatedTrx._id ? updatedTrx : (oldTrx.category.name === updatedTrx.category.name && { ...oldTrx, category: { ...oldTrx.category, icon: updatedTrx.category.icon } }) || oldTrx)), trxToUpdate: null });
    },

    getCategoryStats: async () => {
        try {
            const res = await api.get("/transaction/stats/category-total");
            set({ categoryStats: res.data });
        } catch (error) {
            console.log("Error in category stats", error);
        }
    },

    getStats: async () => {
        try {
            const res = await api.get("/transaction/stats");
            set({ stats: res.data });
        } catch (error) {
            console.log("Error while fetching dashboard stats", error);
        }
    },

    getTransactions: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get("/transactions");
            set({ transactions: res.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log("Error in fetching transactions", error);
        }
    },

    getTransaction: async (id) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/transactions/${id}`);
            set({ transactions: res.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.log("Error in fetching transaction", error);
        }
    },

    deleteTransaction: async (id) => {
        await toast.promise(api.delete(`/transactions/${id}`), {
            loading: "Deleting transaction",
            success: (res) => res?.data?.message || "Transaction deleted successfully",
            error: (error) => error?.response?.data?.message || "Failed to delete transaction",
        });
        set({ transactions: get().transactions.filter((tran) => tran._id !== id) });
    },

    getRecent: () => get().transactions.slice(0, 5),

    getIncomes: () => get().transactions.filter((t) => t.type === "income"),
    getRecentIncomes: () =>
        get()
            .transactions.filter((t) => t.type === "income")
            .slice(0, 5),

    getExpenses: () => get().transactions.filter((t) => t.type === "expense"),
    getRecentExpenses: () =>
        get()
            .transactions.filter((t) => t.type === "expense")
            .slice(0, 5),
}));

export default useTransactionStore;
