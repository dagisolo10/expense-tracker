export default function InputForm({ formRef, type, id, label, icon, placeholder }) {
    return (
        <div className="flex w-full flex-col gap-2">
            <label className="text-sm text-slate-300" htmlFor={id}>
                {label}
            </label>
            <div className="group flex items-center rounded-md border border-slate-500 p-1 focus-within:border-slate-300">
                {icon}
                <input ref={(el) => (formRef.current[id] = el)} className="w-full px-2 text-sm outline-none placeholder:tracking-wider placeholder:text-gray-500/70" placeholder={placeholder} type={type} id={id} />
            </div>
        </div>
    );
}
