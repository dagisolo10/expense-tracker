import { Edit2, Lock, User, X } from "lucide-react";
import authStore from "../store/auth.store";
import { useEffect, useRef, useState } from "react";
import useTransactionStore from "../store/useTransactionStore";

export default function Profile() {
    const profileModalRef = useRef(null);
    const authModalRef = useRef(null);
    const { stats } = useTransactionStore();
    const [profileModal, setProfileModal] = useState(false);
    const [authModal, setAuthModal] = useState(false);
    const { user, updateProfile, terminateAccount } = authStore();
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);
            updateProfile({ profilePic: base64Image });
        };
    };

    const handleTermination = () => {
        if (!window.confirm("Are you sure you want to terminate your account?")) return;
        terminateAccount();
    };

    useEffect(() => {
        const closeModal = (e) => profileModalRef.current && !profileModalRef.current.contains(e.target) && setProfileModal(false);
        window.addEventListener("mousedown", closeModal);
        return () => window.removeEventListener("mousedown", closeModal);
    }, []);
    useEffect(() => {
        const closeModal = (e) => authModalRef.current && !authModalRef.current.contains(e.target) && setAuthModal(false);
        window.addEventListener("mousedown", closeModal);
        return () => window.removeEventListener("mousedown", closeModal);
    }, []);

    return (
        <div className="scrollbar-none bg-container flex-1 space-y-4 overflow-y-auto p-4 text-white xl:rounded-xl">
            {profileModal && <ProfileModal setProfileModal={setProfileModal} profileModalRef={profileModalRef} />}
            {authModal && <AuthModal setAuthModal={setAuthModal} authModalRef={authModalRef} />}
            <div className="flex gap-4">
                <div className="group relative">
                    <img className="size-48 rounded-3xl object-cover" src={selectedImage || user.profilePic || "/avatar.png"} alt="Profile Pic" />
                    <label
                        htmlFor="pic"
                        className="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-center rounded-3xl bg-black/50 opacity-0 transition-all duration-500 group-hover:opacity-100"
                    >
                        Edit profile picture
                    </label>
                    <input className="hidden" onChange={handleImageUpload} accept="image/*" type="file" id="pic" />
                    <button className="absolute right-2 bottom-2">
                        <Edit2 className="text-accent size-4" />
                    </button>
                </div>
                <div className="space-y-4 p-4">
                    <div className="size-fit flex-1 space-y-2">
                        <h1 className="text-4xl font-bold">{user.fullName}</h1>
                        <p className="text-sm text-slate-300">{user.email}</p>
                    </div>
                    <div className="flex size-fit flex-1 justify-between gap-16">
                        <AmountCard color={"white"} label="Balance" value={stats.stats.totalBalance} />
                        <AmountCard color={"green"} label="Income" value={stats.stats.totalIncome} />
                        <AmountCard color={"red"} label="Expense" value={stats.stats.totalExpense} />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setProfileModal(true)}
                    className="border-base bg-card hover:bg-accent/20 text-accent flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold tracking-wide uppercase duration-300"
                >
                    <User className="size-5" />
                    <span>Update Profile</span>
                </button>
                <button
                    onClick={() => setAuthModal(true)}
                    className="border-base bg-card hover:bg-accent/20 text-accent flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold tracking-wide uppercase duration-300"
                >
                    <Lock className="size-5" />
                    <span>Change Password</span>
                </button>
                <button
                    onClick={handleTermination}
                    className="border-base/40 text-h flex cursor-pointer rounded-xl border bg-red-500/40 p-3 text-xs font-semibold tracking-wide uppercase duration-300 hover:bg-red-500/50"
                >
                    Terminate Account
                </button>
            </div>
        </div>
    );
}

function ProfileModal({ profileModalRef, setProfileModal }) {
    const { updateProfile } = authStore();
    const [form, setForm] = useState({ fullName: "", email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(form);
        setProfileModal(false);
    };

    return (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/30 text-white">
            <div ref={profileModalRef} className="bg-container flex h-fit w-10/12 max-w-2xl flex-col rounded-md">
                <div className="border-card flex items-center justify-between border-b px-6 py-4">
                    <h1>Update Profile</h1>
                    <X className="text-accent hover:text-h size-4 cursor-pointer duration-300" onClick={() => setProfileModal(false)} />
                </div>
                <form onSubmit={handleSubmit} className="flex w-full flex-1 flex-col gap-4 px-6 py-4" action="">
                    <Input form={form} setForm={setForm} id={`fullName`} type={`text`} label={`Full Name`} />
                    <Input form={form} setForm={setForm} id={`email`} type={`text`} label={`Email`} />
                    <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 self-end rounded-lg px-4 py-1 text-sm duration-300">Save Changes</button>
                </form>
            </div>
        </div>
    );
}
function AuthModal({ authModalRef, setAuthModal }) {
    const { updateProfile } = authStore();
    const [form, setForm] = useState({ currPassword: "", newPassword: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(form);
        setAuthModal(false);
    };

    return (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/30 text-white">
            <div ref={authModalRef} className="bg-container flex h-fit w-10/12 max-w-2xl flex-col rounded-md">
                <div className="border-card flex items-center justify-between border-b px-6 py-4">
                    <h1>Update Profile</h1>
                    <X className="text-accent hover:text-h size-4 cursor-pointer duration-300" onClick={() => setAuthModal(false)} />
                </div>
                <form onSubmit={handleSubmit} className="flex w-full flex-1 flex-col gap-4 px-6 py-4" action="">
                    <Input form={form} setForm={setForm} id={`currPassword`} type={`text`} label={`Current Password`} />
                    <Input form={form} setForm={setForm} id={`newPassword`} type={`text`} label={`New Password`} />
                    <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 self-end rounded-lg px-4 py-1 text-sm duration-300">Save Changes</button>
                </form>
            </div>
        </div>
    );
}
const Input = ({ form, setForm, label, id, type }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-300" htmlFor={id}>
                {label}
            </label>
            <input onChange={(e) => setForm({ ...form, [id]: e.target.value })} min={0} className="bg-card rounded-md border-0 border-none px-2 py-1 outline-none" id={id} type={type} />
        </div>
    );
};

function AmountCard({ label, value, color }) {
    const formatted = value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    return (
        <div>
            <p className="text-accent text-sm">{label}</p>
            <h1 className={`${color === "red" ? "text-red-500" : color === "green" ? "text-green-500" : "text-h"} text-3xl font-bold`}>{formatted}</h1>
        </div>
    );
}
