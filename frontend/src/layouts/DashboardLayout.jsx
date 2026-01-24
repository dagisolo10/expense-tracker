import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import TransactionModal from "../components/TransactionModal";
import utilStore from "../store/util.store";
import Header from "../components/Header";

export default function DashboardLayout() {
    const { modal } = utilStore();

    return (
        <div className="relative grid h-screen grid-rows-[auto_1fr] overflow-hidden">
            <Header />
            {modal && <TransactionModal />}
            <main className="bg-bg flex gap-2 overflow-hidden xl:p-2">
                <SideBar />
                <Outlet />
            </main>
        </div>
    );
}
