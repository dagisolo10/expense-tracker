import { Navigate, Outlet } from "react-router";
import authStore from "../../store/auth.store";

export default function PublicRoutes() {
    const { user } = authStore();

    if (user) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}
