import { useRef } from "react";
import InputForm from "../components/InputForm";
import { Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import authStore from "../store/auth.store";

export default function Signup() {
    const { signup, isSigningUp } = authStore();
    const navigate = useNavigate();

    const formRef = useRef({ fullName: null, email: null, password: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup({ fullName: formRef.current.fullName.value, email: formRef.current.email.value, password: formRef.current.password.value });
        formRef.current.fullName.value = "";
        formRef.current.email.value = "";
        formRef.current.password.value = "";
        navigate("/dashboard");
    };

    return (
        <div className="col-span-2 flex w-full max-w-lg flex-col justify-center gap-8 justify-self-center text-white lg:col-span-1">
            <div>
                <h1 className="text-4xl font-semibold text-slate-200">Create an account</h1>
                <p className="text-slate-300">Join us today by entering your details below</p>
            </div>
            <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
                <InputForm placeholder="Bob" icon={<User className="size-5 text-slate-600 group-focus-within:text-slate-400" />} label="Full Name" id="fullName" type="text" formRef={formRef} />
                <InputForm placeholder="bob@example.com" icon={<Mail className="size-5 text-slate-600 group-focus-within:text-slate-400" />} label="Email Address" id="email" type="email" formRef={formRef} />
                <InputForm placeholder="Min 8 characters" icon={<Lock className="size-5 text-slate-600 group-focus-within:text-slate-400" />} label="Password" id="password" type="password" formRef={formRef} />
                <button disabled={isSigningUp} className="cursor-pointer rounded-md bg-slate-800 py-1 duration-500 hover:bg-slate-700">
                    Signup
                </button>
            </form>
            <div className="text-slate-300">
                <span>Already have an account? </span>
                <Link to="/login" className="cursor-pointer duration-300 hover:text-white">
                    Login
                </Link>
            </div>
        </div>
    );
}
