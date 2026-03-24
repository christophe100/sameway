import {
  Search,
  CirclePlus,
  CircleUserRound,
  List,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/images/Logo.png";
import { Link, NavLink } from "react-router";
import { useState, useEffect } from "react";
import authService from "../../klaus/src/Services/authservice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au montage et lors des changements du localStorage
  useEffect(() => {
    // Vérifier l'authentification initiale
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };

    checkAuth();

    // Écouter les changements du localStorage (déconnexion depuis une autre page)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { path: "/rechercher", icon: Search, label: "Rechercher" },
    { path: "/ajouter", icon: CirclePlus, label: "Ajouter" },
    { path: "/mestrajets", icon: List, label: "Mes trajets" },
    { path: "/gerer-reservations", icon: List, label: "Mes réservations" },
    { path: "/profil", icon: CircleUserRound, label: "Profil" },
  ];

  const authItems = [
    { path: "/login", icon: CircleUserRound, label: "Se connecter" },
    { path: "/register", icon: CirclePlus, label: "S'inscrire" },
  ];

  return (
    <nav className="flex items-center justify-between w-full py-3 px-4 md:px-10 shadow-xl z-10 top-0 bg-white fixed">
      {/* Logo */}
      <Link to={"/"} className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10" />
        <h3 className="text-lg md:text-xl font-bold hidden sm:block">
          SameWay
        </h3>
      </Link>

      {/* Menu Desktop */}
      <ul className="hidden md:flex items-center gap-2.5">
        {(isAuthenticated ? navItems : authItems).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                `${isActive ? "bg-base-300" : ""} btn btn-ghost rounded-lg hover:border-none`
              }
              to={item.path}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </ul>

      {/* Menu Mobile Toggle */}
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 md:hidden">
          <ul className="flex flex-col p-4 gap-2">
            {(isAuthenticated ? navItems : authItems).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-base-300 text-teal-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
