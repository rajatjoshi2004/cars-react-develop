import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import CarDetails from "./components/Cars/CarDetails";
import Landing from "./pages/Landing";
import Login from "./pages/login/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Search from "./pages/Search/Search";
import ProtectedRoute from "./utils/ProtectedRoute";
import UserProfileUpdate from "./pages/UserProfileUpdate";
import EmailVerification from "./components/emailVerification/EmailVerification";
import EnterOtp from "./pages/EnterOtp";
import AccountVerified from "./components/AccountVerified";
import "./i18n"


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Landing /> },

            // Public routes (redirect if logged in)
            {
                path: "/login",
                element: <ProtectedRoute isAuthRequired={false} />,
                children: [{ path: "/login", element: <Login /> }],
            },
            {
                path: "/register",
                element: <ProtectedRoute isAuthRequired={false} />,
                children: [{ path: "/register", element: <Register /> }],
            },
            {
                path: "/verify-email",
                element: <ProtectedRoute isAuthRequired={false} />,
                children: [{ path: "/verify-email", element: <AccountVerified /> }],
            },

            // Private routes (only accessible when logged in)
            {
                path: "/myaccount",
                element: <ProtectedRoute isAuthRequired={true} />,
                children: [{ path: "/myaccount", element: <Dashboard /> }],
            },

            {
                path: "/security",
                element: <ProtectedRoute isAuthRequired={true} />,
                children: [
                    { path: "/security", element: <UserProfileUpdate /> },
                ],
            },

            { path: "/search", element: <Search /> },
            { path: "/en/search", element: <Search /> },
            { path: "/cars/:id", element: <CarDetails /> },
            { path: "/verify", element: <EmailVerification /> },
            { path: "/otpverify", element: <EnterOtp /> },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);