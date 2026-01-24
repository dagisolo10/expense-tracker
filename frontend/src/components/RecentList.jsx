import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function RecentList({ list, color, label, to }) {
    if (!list.length) return;

    return (
        <div className="bg-card/50 min-h-72 space-y-4 rounded-md p-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-700/50 pb-2">
                <h3 className="text-h text-sm font-semibold sm:text-[1rem] lg:text-lg">{label}</h3>
                <Link to={to} className="bg-card text-h hover:bg-hover flex cursor-pointer items-center gap-2 rounded-md px-4 py-1 duration-500">
                    <span className="text-xs sm:text-sm">See All</span>
                    <ArrowRight className="size-3 sm:size-4" />
                </Link>
            </div>
            <div className="space-y-4 rounded-xl">
                {list?.map((data) => (
                    <div key={data._id} className="border-b-card flex flex-col items-start gap-2 border-b pb-2">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex flex-col">
                                <h2 className="text-h text-sm">{data.category.name}</h2>
                                <p className="text-accent text-sm">{data.description}</p>
                            </div>
                            <div className="text-h rounded-full bg-slate-800 p-2">{data.category.icon}</div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <p className={`text-sm ${color ? color : data.type === "income" ? " text-green-600" : " text-red-700"} `}>${data.amount.toFixed(2)}</p>
                            <p className="text-base text-xs">{new Date(data.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
