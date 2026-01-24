import { Link, useLocation } from "react-router";
import utilStore from "../store/util.store";
import { HandCoins, History, LayoutDashboard, Lock, LogOut, User, Wallet2, X } from "lucide-react";
import authStore from "../store/auth.store";
import { useEffect, useRef } from "react";

export default function SideBar() {
    const { sideBar, toggleSideBar } = utilStore();
    const { user, logout } = authStore();
    const location = useLocation().pathname;
    const sideBarRef = useRef(null);

    useEffect(() => {
        const closeSideBar = (e) => sideBar && !sideBarRef.current.contains(e.target) && toggleSideBar();
        window.addEventListener("mousedown", closeSideBar);
        return () => window.removeEventListener("mousedown", closeSideBar);
    }, [sideBar, toggleSideBar]);

    return (
        <div ref={sideBarRef} className={`bg-bg fixed top-0 z-30 flex h-screen w-96 flex-col gap-4 p-4 pt-8 duration-1000 ease-in-out lg:static lg:h-auto lg:w-1/5 lg:pt-0 ${sideBar ? "left-0" : "-left-full"}`}>
            <div className="space-y-2">
                <div className="mx-auto size-16 overflow-hidden rounded-full">
                    <img className="aspect-square w-full object-cover object-center" src={user?.profilePic || "/avatar.png"} alt="Profile Picture" />
                </div>
                <h1 className="text-center text-xl text-slate-400">{user?.fullName}</h1>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                {[
                    { loc: "/dashboard", span: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
                    { loc: "/transaction", span: "Transaction", icon: <History className="size-5" /> },
                    { loc: "/income", span: "Income", icon: <Wallet2 className="size-5" /> },
                    { loc: "/expense", span: "Expense", icon: <HandCoins className="size-6 sm:size-5" /> },
                    { loc: "/profile", span: "Profile", icon: <User className="size-5" /> },
                ].map((link) => (
                    <Link key={link.span} onClick={toggleSideBar} to={link.loc} className={`flex items-center gap-4 rounded-xl p-2 px-4 text-lg text-slate-400 duration-400 hover:text-slate-300 sm:text-[1rem] ${location === link.loc && "bg-gray-900 text-white"}`}>
                        {link.icon}
                        <span className="">{link.span}</span>
                    </Link>
                ))}
                <button onClick={logout} className={`flex items-center gap-4 rounded-xl p-2 px-4 text-lg text-slate-400 duration-500 hover:text-slate-300 sm:text-[1rem]`}>
                    <LogOut className="size-6 sm:size-5" />
                    <span className="">Logout</span>
                </button>
            </div>
            <button className="p-4 lg:hidden" onClick={toggleSideBar}>
                <X className="text-accent t ml-auto size-5 cursor-pointer" />
            </button>
        </div>
    );
}
