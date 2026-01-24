import { Check, Circle, ImageIcon, X } from "lucide-react";
import utilStore from "../store/util.store";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import useTransactionStore from "../store/useTransactionStore";
import { useLocation } from "react-router";

export default function TransactionModal() {
    const { toggleModal } = utilStore();
    const { addTransaction, updateTransaction, trxToUpdate } = useTransactionStore();

    const modalRef = useRef(null);
    const location = useLocation().pathname;
    const [showPicker, setShowPicker] = useState(false);

    const type = { "/income": "income", "/expense": "expense", "/transaction": "", "/dashboard": "" };
    const add = { "/income": "Add Income", "/expense": "Add Expense", "/transaction": "Add Transaction", "/dashboard": "Add Transaction" };
    const update = { "/income": "Update Income", "/expense": "Update Expense", "/transaction": "Update Transaction", "/dashboard": "Update Transaction" };

    const [form, setForm] = useState({ amount: "", description: "", type: type[location], category: "", icon: "" });

    useEffect(() => {
        if (trxToUpdate) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                amount: trxToUpdate.amount,
                description: trxToUpdate.description,
                type: trxToUpdate.type,
                category: trxToUpdate.category.name,
                icon: trxToUpdate.category.icon,
            });
        }
    }, [trxToUpdate]);

    useEffect(() => {
        const closeModal = (e) => modalRef.current && !modalRef.current.contains(e.target) && toggleModal();
        window.addEventListener("mousedown", closeModal);
        return () => window.removeEventListener("mousedown", closeModal);
    }, [toggleModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (trxToUpdate) updateTransaction(trxToUpdate._id, form);
        else addTransaction(form);
        setForm({ amount: "", description: "", type: type[location], category: "", icon: "" });
        toggleModal();
    };

    return (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/80 text-white">
            <div ref={modalRef} className="bg-container flex h-fit w-10/12 max-w-2xl flex-col rounded-md">
                <div className="border-card flex items-center justify-between border-b px-6 py-4">
                    <h1>{trxToUpdate ? update[location] : add[location]}</h1>
                    <X className="text-accent hover:text-h size-4 cursor-pointer duration-300" onClick={toggleModal} />
                </div>
                <div className="flex flex-col gap-2 px-6 py-2 md:flex-row md:items-center">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-300">Pick Icon</p>
                        <button className="cursor-pointer" onClick={() => setShowPicker((p) => (p = !p))}>
                            {!form.icon ? (
                                <div className="hover:bg-hover bg-card rounded-lg p-2 duration-300">
                                    <ImageIcon className="size-4" />
                                </div>
                            ) : (
                                <p className="text-2xl">{form.icon}</p>
                            )}
                        </button>
                    </div>
                    {showPicker && (
                        <div className="absolute top-1/2 left-1/2 z-40 -translate-1/2">
                            <button onClick={() => setShowPicker(false)} className="text-h absolute right-0 z-50 cursor-pointer p-1.5">
                                <X className="size-4" />
                            </button>
                            <IconPicker form={form} setForm={setForm} setShowPicker={setShowPicker} />
                        </div>
                    )}
                    <p className="text-accent text-sm">Updating category icon will update all category icons</p>
                </div>
                <form onSubmit={handleSubmit} className="flex w-full flex-1 flex-col gap-4 px-6 py-4" action="">
                    <Input form={form} setForm={setForm} id={`category`} type={`text`} label={`Category`} />
                    <Input form={form} setForm={setForm} id={`description`} type={`text`} label={`Description`} />
                    <Input form={form} setForm={setForm} id={`amount`} type={`number`} label={`Amount`} />
                    {location !== "/income" && location !== "/expense" && (
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-slate-300" htmlFor="income">
                                <span>Income</span>
                                <input checked={form.type === "income"} onChange={(e) => setForm({ ...form, type: e.target.id })} className="peer hidden" type="radio" name="type" id="income" />
                                <div className="border-h peer-checked:text-h rounded-md border-[1.5px] text-transparent">
                                    <Check className="size-4" />
                                </div>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-300" htmlFor="expense">
                                <span>Expense</span>
                                <input checked={form.type === "expense"} onChange={(e) => setForm({ ...form, type: e.target.id })} className="peer hidden" type="radio" name="type" id="expense" />
                                <div className="border-h peer-checked:text-h rounded-md border-[1.5px] text-transparent">
                                    <Check className="size-4" />
                                </div>
                            </label>
                        </div>
                    )}
                    <button className="bg-card hover:bg-hover text-accent hover:text-h flex cursor-pointer items-center gap-2 self-end rounded-lg px-4 py-1 duration-300">{trxToUpdate ? update[location] : add[location]}</button>
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
            <input value={form[id]} onChange={(e) => setForm({ ...form, [id]: type === "number" ? Number(e.target.value) : e.target.value })} min={0} className="bg-card rounded-md border-0 border-none px-2 py-1 outline-none" id={id} type={type} />
        </div>
    );
};

const IconPicker = ({ form, setForm, setShowPicker }) => {
    return (
        <EmojiPicker
            theme="dark"
            onEmojiClick={(emojiData) => {
                setForm({ ...form, icon: emojiData.emoji });
                setShowPicker(false);
            }}
        />
    );
};
