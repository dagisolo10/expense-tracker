import { useRef } from "react";
import InputForm from "../components/InputForm";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import authStore from "../store/auth.store";

export default function Login() {
    const { login } = authStore();
    const navigate = useNavigate();

    const formRef = useRef({ email: null, password: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email: formRef.current.email.value, password: formRef.current.password.value });
        formRef.current.email.value = "";
        formRef.current.password.value = "";
        navigate("/dashboard");
    };

    return (
        <div className="col-span-2 flex w-full max-w-lg flex-col justify-center gap-8 justify-self-center text-white lg:col-span-1">
            <div>
                <h1 className="text-4xl font-semibold text-slate-200">Welcome Back</h1>
                <p className="text-slate-300">Please enter your details to login</p>
            </div>
            <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
                <InputForm placeholder="bob@example.com" icon={<Mail className="size-5 text-slate-600 group-focus-within:text-slate-400" />} label="Email Address" id="email" type="email" formRef={formRef} />
                <InputForm placeholder="Min 8 characters" icon={<Lock className="size-5 text-slate-600 group-focus-within:text-slate-400" />} label="Password" id="password" type="password" formRef={formRef} />
                <button className="cursor-pointer rounded-md bg-slate-800 py-1 duration-500 hover:bg-slate-700">Login</button>
            </form>
            <div className="text-slate-400">
                <span>Don't have an account? </span>
                <Link to="/signup" className="cursor-pointer duration-300 hover:text-white">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
