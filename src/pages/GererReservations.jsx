/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import reservationService from "../../klaus/src/Services/Reservationservice";
import trajetService from "../../klaus/src/Services/trajetservice";
import { motion } from "motion/react";

const GererReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("tous");
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const statusColors = {
    confirmee: "bg-green-100 text-green-800",
    en_attente: "bg-yellow-100 text-yellow-800",
    annulee: "bg-red-100 text-red-800",
    terminee: "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    confirmee: "Confirmée",
    en_attente: "En attente",
    annulee: "Annulée",
    terminee: "Terminée",
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await reservationService.getMyReservations();
        // Gérer différentes structures de réponse
        let reservationsArray = [];
        if (Array.isArray(data)) {
          reservationsArray = data;
        } else if (data?.data && Array.isArray(data.data)) {
          reservationsArray = data.data;
        } else if (data?.reservations && Array.isArray(data.reservations)) {
          reservationsArray = data.reservations;
        }
        // Normaliser les champs des trajets/réservations pour l'affichage
        const normalizeTrajet = (t) => {
          t = t || {};
          const conducteur = t.conducteur || t.driver || {};
          const conducteurNom =
            conducteur?.nom || conducteur?.name || t.conducteur_nom || "";

          return {
            _id: t._id || t.id,
            departCity:
              t.ville_depart || t.villeDepart || t.departCity || t.from || "",
            destinationCity:
              t.ville_arrivee ||
              t.ville_destination ||
              t.destinationCity ||
              t.to ||
              "",
            dateDepart:
              t.date_depart || t.date_trajet || t.date || t.departDate || null,
            time: t.heure_depart || t.time || t.heure || "",
            vehicule: t.vehicule || t.vehicle || "",
            prix_par_place: t.prix_par_place ?? t.prix ?? t.price ?? null,
            conducteur: {
              nom: conducteurNom,
              prenom: conducteur?.prenom || conducteur?.firstName || "",
              photo: conducteur?.photo || conducteur?.avatar || null,
              telephone: conducteur?.telephone || conducteur?.phone || null,
            },
            dureeEstimee: t.dureeEstimee || t.duree || t.duration || null,
            // garder toutes les autres propriétés si nécessaire
            ...t,
          };
        };

        const normalized = reservationsArray.map((r) => ({
          ...r,
          trajet: normalizeTrajet(r.trajet),
        }));

        setReservations(normalized);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des réservations:", err);
        setError(err.message || "Erreur lors du chargement des réservations");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    console.log(reservationService);

    if (!Array.isArray(reservations)) {
      setFilteredReservations([]);
      return;
    }
    if (selectedStatus === "tous") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter((res) => res.statut === selectedStatus),
      );
    }
  }, [selectedStatus, reservations]);

  const handleCancelReservation = async (reservationId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")
    ) {
      try {
        setActionLoading(reservationId);
        await reservationService.cancelReservation(reservationId);
        // Mettre à jour en convertissant les IDs en strings pour la comparaison
        setReservations(
          reservations.map((res) =>
            String(res._id) === String(reservationId)
              ? { ...res, statut: "annulee" }
              : res,
          ),
        );
      } catch (err) {
        alert("Erreur lors de l'annulation: " + err.message);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleConfirmReservation = async (reservationId) => {
    try {
      setActionLoading(reservationId);
      await reservationService.confirmReservation(reservationId);
      // Mettre à jour en convertissant les IDs en strings pour la comparaison
      setReservations(
        reservations.map((res) =>
          String(res._id) === String(reservationId)
            ? { ...res, statut: "confirmee" }
            : res,
        ),
      );
    } catch (err) {
      alert("Erreur lors de la confirmation: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] pt-24 px-4 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Gérer mes réservations
          </h1>
          <p className="text-gray-200">
            {filteredReservations.length} réservation(s)
          </p>
        </div>

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["tous", "en_attente", "confirmee", "terminee", "annulee"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedStatus === status
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {status === "tous" ? "Tous" : statusLabels[status]}
              </button>
            ),
          )}
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white text-lg">Chargement des réservations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        ) : !Array.isArray(filteredReservations) ||
          filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              {selectedStatus === "tous"
                ? "Aucune réservation trouvée"
                : `Aucune réservation ${statusLabels[selectedStatus].toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(filteredReservations) &&
              filteredReservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Carte résumée */}
                  <div
                    className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
                    onClick={() =>
                      setExpandedId(
                        expandedId === reservation._id ? null : reservation._id,
                      )
                    }
                  >
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col md:flex-row md:items-center gap-4 mb-2"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {reservation.trajet?.departCity || "Départ"} →{" "}
                            {reservation.trajet?.destinationCity ||
                              "Destination"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {reservation.trajet?.dateDepart
                              ? new Date(
                                  reservation.trajet.dateDepart,
                                ).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Date non disponible"}{" "}
                            à{" "}
                            {reservation.trajet?.dateDepart
                              ? new Date(
                                  reservation.trajet.dateDepart,
                                ).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Heure non disponible"}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="text-right">
                            <p className="font-bold text-teal-600">
                              {reservation.montant_total} FCFA
                            </p>
                            <p className="text-sm text-gray-600">
                              {reservation.nb_places} place(s)
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold text-center ${
                              statusColors[reservation.statut]
                            }`}
                          >
                            {statusLabels[reservation.statut]}
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Chevron */}
                    <div className="flex md:hidden">
                      <svg
                        className={`w-6 h-6 text-gray-600 transition-transform ${
                          expandedId === reservation._id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Détails étendus */}
                  {expandedId === reservation._id && (
                    <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Infos trajet */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Détails du trajet
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">
                              <span className="font-semibold">Conducteur:</span>{" "}
                              {reservation.trajet?.conducteur?.nom || "N/A"}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Téléphone:</span>{" "}
                              {reservation.trajet?.conducteur?.telephone ||
                                "N/A"}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Durée estimée:
                              </span>{" "}
                              {reservation.trajet?.dureeEstimee || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Infos réservation */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Détails de la réservation
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Nombre de places:
                              </span>{" "}
                              {reservation.nb_places}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Montant total:
                              </span>{" "}
                              <span className="text-teal-600 font-bold">
                                {reservation.montant_total} FCFA
                              </span>
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">
                                Réservée le:
                              </span>{" "}
                              {reservation.date_reservation
                                ? new Date(
                                    reservation.date_reservation,
                                  ).toLocaleDateString("fr-FR")
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col md:flex-row gap-3 md:justify-end">
                        {/* {reservation.statut === "en_attente" && (
                          <button
                            onClick={() =>
                              handleConfirmReservation(reservation._id)
                            }
                            disabled={actionLoading === reservation._id}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                          >
                            {actionLoading === reservation._id
                              ? "Confirmation..."
                              : "Confirmer"}
                          </button>
                        )} */}

                        {(reservation.statut === "en_attente" ||
                          reservation.statut === "confirmee") && (
                          <button
                            onClick={() =>
                              handleCancelReservation(reservation._id)
                            }
                            disabled={actionLoading === reservation._id}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                          >
                            {actionLoading === reservation._id
                              ? "Annulation..."
                              : "Annuler"}
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === reservation._id
                                ? null
                                : reservation._id,
                            )
                          }
                          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GererReservations;
