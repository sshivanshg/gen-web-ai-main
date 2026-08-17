import axios from "axios";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BRAND } from "../brand";
import { clearUserData } from "../redux/userSlice";
import { serverURL } from "../config";
import { clearAuthToken } from "../authToken";

const Navbar = ({ children }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);
    const onProjects = pathname === "/projects" || pathname === "/dashboard";

    const handleLogout = async () => {
        try {
            await axios.post(`${serverURL}/api/auth/logout`, {});
        } finally {
            clearAuthToken();
            dispatch(clearUserData());
            navigate("/");
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/75 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2.5 text-ink"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                    <span className="font-display text-[1.35rem] leading-none tracking-tight">
                        {BRAND.name}
                    </span>
                    {BRAND.kicker && (
                        <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted">
                            {BRAND.kicker}
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-5">
                    <NavLink
                        to="/projects"
                        className={`hidden text-[13px] tracking-wide transition sm:inline ${
                            onProjects
                                ? "text-ink"
                                : "text-muted hover:text-ink"
                        }`}
                        >
                        Projects
                    </NavLink>
                    {userData ? (
                        <button
                            onClick={handleLogout}
                            className="hidden text-[13px] tracking-wide text-muted transition hover:text-ink sm:inline"
                        >
                            Sign out
                        </button>
                    ) : (
                        <NavLink
                            to="/auth"
                            className="hidden text-[13px] tracking-wide text-muted transition hover:text-ink sm:inline"
                        >
                            Sign in
                        </NavLink>
                    )}
                    {children}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
