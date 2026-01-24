import { Menu, X } from "lucide-react";
import utilStore from "../store/util.store";

export default function Header() {
    const { toggleSideBar } = utilStore();

    return (
        <div className="bg-bg flex w-full items-center gap-8 p-4">
            <Menu className="text-accent size-5 cursor-pointer lg:hidden" onClick={toggleSideBar} />
            <h1 className="text-xl text-slate-300 lg:text-2xl">Expense Tracker</h1>
        </div>
    );
}
