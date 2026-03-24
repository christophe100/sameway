import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Rechercher from "./pages/Rechercher";
import Ajouter from "./pages/Ajouter";
import Profil from "./pages/Profil";
import MesTrajets from "./pages/MesTrajets";
import GererReservations from "./pages/GererReservations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/rechercher" element={<Rechercher />} />
        <Route path="/ajouter" element={<Ajouter />} />
        <Route path="/mestrajets" element={<MesTrajets />} />
        <Route path="/gerer-reservations" element={<GererReservations />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
