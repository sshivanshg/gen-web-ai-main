import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BRAND } from "../brand";

const Navbar = ({ children }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const onProjects = pathname === "/projects" || pathname === "/dashboard";

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
                    {children}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
