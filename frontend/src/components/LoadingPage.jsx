import { Loader } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="h-screen bg-black flex items-center justify-center">
            <Loader className="text-slate-300 size-16 animate-spin" />
        </div>
    );
}
