import { useEffect, useState } from "react";
import PageBackground from "../components/PageBackground";
import trajetService from "../../backend/src/Services/trajetservice";
import reservationService from "../../backend/src/Services/Reservationservice";
import authService from "../../backend/src/Services/authservice";
import { Trash2 } from "lucide-react";

const MesTrajets = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({}); // track expanded reservations per trajetId
  const [reservationsMap, setReservationsMap] = useState({});

  const currentUser = authService.getCurrentUser();

  const fetchMyTrajets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await trajetService.getMyTrajets();
      const data = res.trajets || res;
      setTrips(data);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des trajets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTrajets();
  }, []);

  const handleDelete = async (trajet) => {
    const id = trajet._id || trajet.id;
    if (!id) return;
    if (!window.confirm("Confirmer la suppression de ce trajet ?")) return;
    try {
      await trajetService.deleteTrajet(id);
      await fetchMyTrajets();
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const toggleReservations = async (trajet) => {
    const id = trajet._id || trajet.id;
    if (!id) return;
    const isOpen = !!expanded[id];
    if (isOpen) {
      setExpanded((s) => ({ ...s, [id]: false }));
      return;
    }

    // open and load reservations if not loaded
    if (!reservationsMap[id]) {
      try {
        const res = await reservationService.getTrajetReservations(id);
        const list = res.reservations || res;
        setReservationsMap((m) => ({ ...m, [id]: list }));
      } catch (err) {
        alert(err.message || "Erreur lors du chargement des réservations");
        setReservationsMap((m) => ({ ...m, [id]: [] }));
      }
    }

    setExpanded((s) => ({ ...s, [id]: true }));
  };

  const confirmReservation = async (reservationId, trajetId) => {
    if (!window.confirm("Confirmer cette réservation ?")) return;
    try {
      await reservationService.confirmReservation(reservationId);
      // refresh reservations list
      const res = await reservationService.getTrajetReservations(trajetId);
      const list = res.reservations || res;
      setReservationsMap((m) => ({ ...m, [trajetId]: list }));
      // refresh trips as places may have changed
      await fetchMyTrajets();
    } catch (err) {
      alert(err.message || "Erreur lors de la confirmation");
    }
  };

  const handleCompleteTrajet = async (trajet) => {
    const id = trajet._id || trajet.id;
    if (!id) return;

    if (
      !window.confirm(
        "Marquer ce trajet comme terminé ? Les passagers pourront vous évaluer.",
      )
    ) {
      return;
    }

    try {
      await trajetService.completeTrajet(id);
      await fetchMyTrajets();
      // Refresh reservations displayed for this trip if open
      if (expanded[id]) {
        const res = await reservationService.getTrajetReservations(id);
        const list = res.reservations || res;
        setReservationsMap((m) => ({ ...m, [id]: list }));
      }
    } catch (err) {
      alert(err.message || "Erreur lors de la clôture du trajet");
    }
  };

  return (
    <div className="  pt-30 px-4 min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          Mes trajets
        </h1>

        {loading && (
          <div className="p-4 bg-white rounded shadow text-center">
            Chargement...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="p-6 bg-white rounded shadow text-center w-full">
            Vous n'avez aucun trajet publié.
          </div>
        )}

        <ul className="space-y-4">
          {trips.map((t) => {
            const id = t._id || t.id;
            const depart = t.ville_depart || t.depart || t.departName || "";
            const destination =
              t.ville_arrivee || t.ville_arrivee || t.destination || "";
            const dateStr = t.date_depart
              ? new Date(t.date_depart).toLocaleDateString()
              : "";
            const heure = t.heure_depart || t.heure || t.time || "";

            const isOwner =
              currentUser &&
              ((t.conducteur &&
                (t.conducteur._id || t.conducteur) === currentUser._id) ||
                (t.conducteur &&
                  (t.conducteur._id || t.conducteur) === currentUser.id));

            return (
              <li
                key={id}
                className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-lg text-gray-900">
                    {depart} → {destination}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateStr} {heure ? ` • ${heure}` : ""}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Places: {t.places_disponibles ?? t.places_totales} • Prix:{" "}
                    {t.prix_par_place ?? "-"}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col items-center gap-2">
                  <button
                    onClick={() => toggleReservations(t)}
                    className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                  >
                    {expanded[id]
                      ? "Masquer réservations"
                      : "Voir réservations"}
                  </button>

                  {isOwner && (
                    <>
                      {t.statut !== "termine" && t.statut !== "annule" && (
                        <button
                          onClick={() => handleCompleteTrajet(t)}
                          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                        >
                          Marquer terminé
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(t)}
                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </>
                  )}
                </div>

                {expanded[id] && (
                  <div className=" bg-[#51898E] p-3 rounded  shadow-inner">
                    <h4 className="font-semibold mb-2 text-white">
                      Réservations
                    </h4>
                    {(!reservationsMap[id] ||
                      reservationsMap[id].length === 0) && (
                      <div className="text-sm text-white">
                        Aucune réservation.
                      </div>
                    )}
                    {reservationsMap[id] &&
                      reservationsMap[id].map((r) => (
                        <div
                          key={r._id || r.id}
                          className="flex items-center justify-between py-2 border-b last:border-b-0 "
                        >
                          <div>
                            <div className="font-medium">
                              {r.passager?.nom ||
                                r.user?.nom ||
                                r.passagerName ||
                                "Utilisateur"}
                            </div>
                            <div className="text-sm text-gray-600">
                              Places: {r.places || 1} • Statut:{" "}
                              {r.statut || r.status}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {r.statut === "pending" ||
                            r.statut === "en_attente" ||
                            r.status === "pending" ? (
                              <button
                                onClick={() =>
                                  confirmReservation(r._id || r.id, id)
                                }
                                className="btn btn-sm bg-green-500 hover:bg-green-600 text-white rounded"
                              >
                                Confirmer
                              </button>
                            ) : (
                              <div className="text-sm ml-2 badge badge-sm badge-ghost">
                                {r.statut || r.status}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MesTrajets;
