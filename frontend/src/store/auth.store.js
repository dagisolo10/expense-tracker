import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

const authStore = create((set) => ({
    user: null,
    isUserChecking: false,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdating: false,
    isTerminating: false,

    checkUser: async () => {
        set({ isUserChecking: true });
        try {
            const res = await api("/auth/get-profile");
            set({ user: res.data });
        } catch {
            set({ user: null });
        } finally {
            set({ isUserChecking: false });
        }
    },

    terminateAccount: async () => {
        set({ isTerminating: true });
        try {
            await toast.promise(api.delete("/user"), {
                loading: "Terminating Account...",
                success: (res) => res?.data?.message || "Account Terminated!",
                error: (err) => err?.response?.data?.message || "Failed to terminate account",
            });
            set({ user: null });
        } finally {
            set({ isTerminating: false });
        }
    },
    updateProfile: async (form) => {
        set({ isUpdating: true });
        try {
            const res = await toast.promise(api.patch("/user/update", form), {
                loading: "Updating profile...",
                success: (res) => res?.data?.message || "Profile updated!",
                error: (err) => err?.response?.data?.message || "Failed to update profile",
            });
            set({ user: res.data });
        } finally {
            set({ isUpdating: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await toast.promise(api.post("/auth/signup", data), {
                loading: "Signing up...",
                success: (res) => res?.data?.message || "Account created successfully 🎉",
                error: (err) => err?.response?.data?.message || "Failed to sign up",
            });
            set({ user: res.data });
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await toast.promise(api.post("/auth/login", data), {
                loading: "Logging in...",
                success: (res) => res?.data?.message || "Logged in successfully 🎉",
                error: (err) => err?.response?.data?.message || "Failed to login",
            });
            set({ user: res.data });
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await toast.promise(api.post("/auth/logout"), {
                loading: "Logging out...",
                success: (res) => res?.data?.message || "Logged out successfully 👋",
                error: (err) => err?.response?.data?.message || "Failed to logout",
            });
            set({ user: null });
        } finally {
            set({ isLoggingOut: false });
        }
    },
}));

export default authStore;
