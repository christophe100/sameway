/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import RechercherForm from "../components/rechercher/RechercherForm";
import TrajetCard from "../components/rechercher/TrajetCard";
import { Construction } from "lucide-react";
import trajetService from "../../klaus/src/Services/trajetservice";

const Rechercher = () => {
  const [trajets, setTrajets] = useState([]);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fofnction pour récupérer les trajets depuis l'API

  const fetchTrajets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trajetService.getTrajets();
      // La réponse peut être { count, trajets } ou un tableau directement
      const items = Array.isArray(data) ? data : data?.trajets || [];

      setDatas(items);

      const trajetsFormatted = (items || []).map((trajet) => {
        const id = trajet._id || trajet.id;
        const conducteur = trajet.conducteur || {};
        const price = trajet.prix_par_place ?? "N/A";
        const driverName = conducteur.nom
          ? `${conducteur.nom.toUpperCase()} ${conducteur.prenom || ""}`.trim()
          : trajet.conducteur_nom || "Conducteur";
        const telephone = conducteur.telephone;
        const driverInitial = (driverName || "").charAt(0).toUpperCase();
        const driverRating =
          conducteur.note_moyenne || trajet.conducteur_note || "4";
        const departCity = trajet.ville_depart || trajet.villeDepart || "";
        const destinationCity =
          trajet.ville_arrivee || trajet.ville_destination || "";
        const date =
          trajet.date_depart || trajet.date_trajet || trajet.date || null;
        const dateFormatted = date ? new Date(date).toLocaleDateString() : "";
        const time = trajet.heure_depart || trajet.time || "";
        const availablePlaces =
          trajet.places_disponibles ?? trajet.placesDisponibles ?? 0;

        return {
          _id: id,
          phone: telephone,
          driverName,
          driverInitial,
          driverRating,
          departCity,
          destinationCity,
          date: dateFormatted,
          time,
          availablePlaces,
          price,
        };
      });

      setTrajets(trajetsFormatted);
    } catch (err) {
      console.error("getTrajets error:", err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les trajets au chargement du composant
  useEffect(() => {
    fetchTrajets();
  }, []);
  // // Fonction à appeler quand le formulaire est soumis
  // const handleSearch = (filters) => {
  //   fetchTrajets(filters);
  // };

  return (
    <div className="pt-20 flex justify-center min-h-screen items-center flex-col bg-linear-to-b from-[#51898E] to-[#172628] px-5  ">
      {/* <RechercherForm onSearch={handleSearch} /> */}
      <RechercherForm />
      <div className="md:w-4xl">
        <h2 className=" font-bold text-2xl mt-10 text-left text-white">
          Trajets Disponibles
        </h2>
      </div>
      <div className="p-10  bg-[#2121212f] backdrop-blur-lg rounded-lg shadow-lg shadow-[#000000a8] md:min-w-4xl  flex flex-col items-center justify-center mt-5 md:min-h-100 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-5 border-b-5 border-white"></div>
            <p className="text-white mt-4 text-lg">Chargement des trajets...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-col">
            <Construction
              strokeWidth={1}
              className="w-20 h-20 md:h-50 md:w-50 text-white"
            />
            <p className="text-red-500 mt-4 text-lg">
               Problème de connection
            </p>
          </div>
        ) : trajets.length < 1 ? (
          <div className="w-full">
            <div className=" mt-10 flex items-center justify-center flex-col">
              <Construction
                strokeWidth={1}
                className="w-20 h-20 md:h-50 md:w-50 text-white"
              />
              <p className="text-white mt-4 text-lg text-center">
                Aucun trajet n'est disponible pour le moment
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full flex flex-col items-center justify-center">
            {trajets.map((trajet, index) => (
              <TrajetCard key={index} trajet={trajet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rechercher;
