import { create } from "zustand";
import useTransactionStore from "./useTransactionStore";

const utilStore = create((set, get) => ({
    sideBar: false,
    modal: false,

    randAmount: () => {
        return Math.floor(Math.random() * 1000);
    },

    isInThisMonth: (date) => {
        const now = new Date();

        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        return monthStart <= date && date <= monthEnd;
    },

    getWeekExtremes: () => {
        const today = new Date();
        const day = today.getDay();

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - day);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return { weekStart, weekEnd };
    },

    isInThisWeek: (date) => {
        const { weekStart, weekEnd } = get().getWeekExtremes();

        return weekStart <= date && date <= weekEnd;
    },

    toggleModal: () => {
        const isOpening = !get().modal;

        if (!isOpening) useTransactionStore.getState().setTrxToUpdate(null);
        set({ modal: isOpening });
    },
    toggleSideBar: () => {
        set({ sideBar: !get().sideBar });
    },
}));

export default utilStore;
