import { useState } from "react";
import reservationService from "../../../backend/src/Services/Reservationservice";
import authService from "../../../backend/src/Services/authservice";
import WhatsAppButton from "../WhatsappButton";
import { useNavigate } from "react-router";

const TrajetCard = ({ trajet }) => {
  const {
    id,
    driverName,
    driverInitial,
    driverPhoto,
    driverRating,
    departCity,
    destinationCity,
    date,
    time,
    availablePlaces,
    price,
    phone,
  } = trajet;
  const [isReserving, setIsReserving] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [driverPhone, setDriverPhone] = useState(null);
  const navigate = useNavigate();

  const handleReserve = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        alert("Veuillez vous connecter pour réserver ce trajet.");
        return;
      }

      const trajetId = trajet._id || trajet.id || id;
      if (!trajetId) {
        alert("Impossible de réserver : identifiant du trajet manquant.");
        return;
      }

      const payload = {
        trajet: trajetId,
        passager: user._id || user.id,
        nb_places: 1,
        // montant_total peut être omis ; le backend calcule si absent
      };

      setIsReserving(true);
      await reservationService.createReservation(payload);

      // Récupérer le numéro de téléphone du conducteur
      setDriverPhone(phone || "N/A");
      setShowContactModal(true);
    } catch (err) {
      const msg = err?.message || err?.message || JSON.stringify(err);
      alert("Erreur lors de la réservation: " + msg);
    } finally {
      setIsReserving(false);
      // navigate("/gerer-reservations");
    }
  };

  return (
    <>
      {/* Modal de contact */}
      {showContactModal && (
        <div className="absolute flex items-center justify-center z-50 p-4 top-0">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Réservation confirmée !
            </h2>
            <p className="text-gray-600 mb-6">
              Contactez le conducteur pour finaliser les détails du trajet :
            </p>

            <div className="bg-teal-50 border-2 border-teal-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Numéro de téléphone du conducteur :
              </p>
              {driverPhone ? (
                <>
                  <WhatsAppButton phone={driverPhone} />
                </>
              ) : (
                <p className="text-gray-600 font-semibold">
                  Numéro non disponible
                </p>
              )}
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Carte du trajet */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-100 rounded-lg p-4  shadow-sm w-full mb-4">
        {/* Section conducteur */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Avatar circulaire */}
          <div className="flex flex-col items-center">
            {driverPhoto ? (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0">
                <img
                  src={driverPhoto}
                  alt={`Photo de ${driverName}`}
                  className="w-full h-full object-cover block"
                />
              </div>
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0">
                {driverInitial}
              </div>
            )}
          </div>

          {/* Informations conducteur */}
          <div className="w-full md:w-auto text-left md:text-left">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {driverName}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-gray-700">{driverRating}</span>
            </div>
          </div>
        </div>

        {/* Section trajet */}
        <div className="w-full md:flex-1 md:mx-8 my-3 md:my-0">
          <ul className="space-y-2 text-gray-800">
            <li className=" text-sm">
              <span className="font-bold">Départ:</span>{" "}
              <span className="">{departCity}</span>
            </li>
            <li className=" text-sm">
              <span className="font-bold ">Destination:</span>{" "}
              <span className="">{destinationCity}</span>
            </li>
          </ul>
        </div>

        {/* Section date et places */}
        <div className="flex flex-col md:items-end items-start gap-2 mx-0 md:mx-4 w-full md:w-auto">
          <div className="w-full md:text-right text-left">
            <p className="text-md md:text-lg font-semibold text-gray-900">
              {date} - {time}
            </p>
            <p className="text-gray-600">
              Places:{" "}
              <span
                className={
                  availablePlaces === 0
                    ? "text-red-400 font-bold"
                    : "text-green-500 font-bold"
                }
              >
                {availablePlaces === 0 ? "Complet" : availablePlaces}
              </span>
            </p>
          </div>

          {/* Prix du trajet */}
          <div className="w-full md:w-auto text-left md:text-right">
            <p className="text-md md:text-lg font-bold text-green-600">
              {price} FCFA
            </p>
          </div>

          {/* Bouton réserver */}
          <button
            onClick={handleReserve}
            disabled={isReserving}
            className={`btn bg-[#3a6265] rounded-lg text-white hover:bg-[#3a6a6d] transition-colors ${
              isReserving ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isReserving ? "Réservation..." : "Réserver"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TrajetCard;
