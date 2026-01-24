import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";
import authStore from "./store/auth.store";
import { useEffect } from "react";
import LoadingPage from "./components/LoadingPage";
import TransactionPage from "./pages/TransactionPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PublicRoutes from "./components/routes/PublicRoutes";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

function App() {
    const { user, checkUser, isUserChecking } = authStore();
    console.log("user");

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    if (isUserChecking) return <LoadingPage />;

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
            </Route>

            <Route element={<DashboardLayout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/income" element={<IncomePage />} />
                    <Route path="/expense" element={<ExpensePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transaction" element={<TransactionPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
