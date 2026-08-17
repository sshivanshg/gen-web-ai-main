import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import Editor from "./pages/WebSiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import RequireAuth from "./components/RequireAuth";
import { clearUserData, setUserData } from "./redux/userSlice";
import { serverURL } from "./config";
import { getAuthToken } from "./authToken";

const App = () => {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        axios.defaults.withCredentials = true;
        const interceptor = axios.interceptors.request.use((config) => {
            const token = getAuthToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const loadUser = async () => {
            try {
                const result = await axios.get(`${serverURL}/api/auth/me`, {
                });
                dispatch(setUserData(result.data.user));
            } catch {
                dispatch(clearUserData());
            } finally {
                setReady(true);
            }
        };

        loadUser();
        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [dispatch]);

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
                Loading your workspace…
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-paper font-sans text-ink">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                        path="/projects"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/generate"
                        element={
                            <RequireAuth>
                                <Generate />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/editor/:id"
                        element={
                            <RequireAuth>
                                <Editor />
                            </RequireAuth>
                        }
                    />
                    <Route path="/site/:id" element={<LiveSite />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
