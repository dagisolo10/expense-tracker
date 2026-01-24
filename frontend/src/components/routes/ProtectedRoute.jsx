import { Navigate, Outlet } from "react-router";
import authStore from "../../store/auth.store";

export default function ProtectedRoute() {
    const { user } = authStore();

    if (!user) return <Navigate to={"/login"} replace />;

    return <Outlet />;
}
