import { useFormContext } from "../context/FormContext";
import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import { motion } from "motion/react";
import trajetService from "../../klaus/src/Services/trajetservice";

const AjouterForm = ({ onSubmit }) => {
  const [depart, setDepart] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [places, setPlaces] = useState("");
  const [prix, setPrix] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    state,
    loadCampuses,
    getDisplayName,
    handleDepartChange,
    handleDestChange,
    selectDepart,
    selectDest,
    closeDropdowns,
    getChangeHandler,
    setStep,
  } = useFormContext();

  const wrapperRef = useRef();

  // Charger les campus au montage
  useEffect(() => {
    loadCampuses();
  }, []);

  // Fermer les dropdowns au clic externe
  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeDropdowns();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [closeDropdowns]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (state.step === 1) {
      // Vérifier que départ et destination sont remplis avant de passer à l'étape 2
      if (depart.trim() && destination.trim()) {
        setStep(2);
      } else {
        setError("Veuillez remplir le départ et la destination");
      }
    } else if (state.step === 2) {
      // À l'étape 2, valider et soumettre le formulaire
      if (!date || !heure || !places || !prix) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      try {
        setLoading(true);

        // Combiner la date et l'heure
        const dateTime = new Date(`${date}T${heure}`);

        // Préparer les données pour le backend
        const trajetData = {
          ville_depart: depart.trim(),
          ville_arrivee: destination.trim(),
          date_depart: dateTime.toISOString(),
          heure_depart: heure,
          places_totales: parseInt(places, 10),
          prix_par_place: parseFloat(prix)
        };

        // Appeler le service pour créer le trajet
        const response = await trajetService.createTrajet(trajetData);

        setSuccess("Trajet crée avec succès!");
        
        // Réinitialiser le formulaire
        setDepart("");
        setDestination("");
        setDate("");
        setHeure("");
        setPlaces("");
        setPrix("");
        setStep(1);

        // Appeler le callback onSubmit si fourni
        if (onSubmit) {
          onSubmit(response);
        }

        // Rediriger vers "Mes trajets" après 2 secondes
        setTimeout(() => {
          window.location.href = "/mestrajets";
        }, 2000);
      } catch (err) {
        console.error("Erreur lors de la création du trajet:", err);
        setError(err.message || "Erreur lors de la création du trajet");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center justify-center w-96 md:w-1/3 bg-[rgba(0,0,0,0.28)] backdrop-blur-sm rounded-lg shadow-xl shadow-[#313131] gap-10 p-10"
      ref={wrapperRef}
    >
      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="w-full bg-red-500 text-white p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full bg-green-500 text-white p-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="flex flex-col items-center justify-center gap-2 w-full">
        {state.step === 1 ? (
          <>
            {/* Étape 1: Champ Départ et Destination */}
            {/* Champ Départ avec autocomplete */}
            <div className="w-full relative">
              <Input
                placeholder={"Départ"}
                value={depart}
                onchange={(e) =>
                  setDepart(e.target.value) ||
                  handleDepartChange(e.target.value)
                }
              />
              {state.showDepartDropdown && (
                <ul className="absolute z-50 left-0 right-0 bg-white rounded-md shadow-lg max-h-44 overflow-auto mt-2">
                  {state.departSuggestions.map((s, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => setDepart(getDisplayName(s))}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {getDisplayName(s)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Champ Destination avec autocomplete */}
            <div className="w-full relative">
              <Input
                placeholder={"Destination"}
                value={destination}
                onchange={(e) =>
                  setDestination(e.target.value) ||
                  handleDestChange(e.target.value)
                }
              />
              {state.showDestDropdown && (
                <ul className="absolute z-50 left-0 right-0 bg-white rounded-md shadow-lg max-h-44 overflow-auto mt-2">
                  {state.destSuggestions.map((s, idx) => (
                    <li
                      key={idx}
                      onMouseDown={() => setDestination(getDisplayName(s))}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {getDisplayName(s)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Étape 2: Champ Date et Heure */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className=" flex items-center justify-center w-full gap-4"
            >
              <Input
                placeholder={"jj/mm/aaaa"}
                type={"date"}
                value={date}
                onchange={(e) => setDate(e.target.value)}
              />
              <Input
                placeholder={"HH:MM"}
                type={"time"}
                value={heure}
                onchange={(e) => setHeure(e.target.value)}
              />
            </motion.div>
            {/* Champ Heure de départ */}

            {/* Champ Places disponibles */}
            <Input
              placeholder={"Places disponibles"}
              type={"number"}
              value={places}
              onchange={(e) => setPlaces(e.target.value)}
            />
            {/* Champ Prix */}
            <Input
              placeholder={"Prix"}
              type={"number"}
              value={prix}
              onchange={(e) => setPrix(e.target.value)}
            />
          </>
        )}
      </div>

      <div className="flex gap-4 w-full">
        {state.step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={loading}
            className="btn btn-lg bg-gray-500 rounded-lg flex-1 shadow-lg shadow-black border-none hover:scale-102 hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Retour
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn md:btn-lg bg-[#51898E] rounded-lg flex-1 shadow-lg shadow-black border-none hover:scale-102 hover:bg-[#457a7f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Traitement..."
            : state.step === 1
            ? "Suivant"
            : "Ajouter le trajet"}
        </button>
      </div>
    </motion.form>
  );
};


export default AjouterForm;
