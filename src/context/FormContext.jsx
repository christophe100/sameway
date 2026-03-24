import { createContext, useContext, useReducer } from "react";
import trajetService from "../../klaus/src/Services/trajetservice";

// Création du contexte pour le formulaire
const FormContext = createContext(null);

// État initial du formulaire
const initialState = {
  // Ville de départ
  depart: "",
  // Ville de destination
  destination: "",
  // Date du trajet (format ISO ou géré par le composant input)
  date: "",
  // Heure du trajet
  heure: "",
  // Étape actuelle du formulaire (1 = départ/destination, 2 = date/heure)
  step: 1,
  // Indique si une soumission est en cours
  loading: false,
  // Message d'erreur éventuel
  error: null,
  // Résultats de la recherche de trajets
  searchResults: [],
  // Données pour l'autocomplete
  campuses: [],
  // État des suggestions d'autocomplete
  departSuggestions: [],
  destSuggestions: [],
  departQuery: "",
  destQuery: "",
  showDepartDropdown: false,
  showDestDropdown: false,
};

// Types d'actions utilisés par le reducer
const actionTypes = {
  SET_FIELD: "SET_FIELD",
  RESET: "RESET",
  SUBMIT_START: "SUBMIT_START",
  SUBMIT_END: "SUBMIT_END",
  SET_ERROR: "SET_ERROR",
  SET_CAMPUSES: "SET_CAMPUSES",
  SET_DEPART_QUERY: "SET_DEPART_QUERY",
  SET_DEST_QUERY: "SET_DEST_QUERY",
  SET_DEPART_SUGGESTIONS: "SET_DEPART_SUGGESTIONS",
  SET_DEST_SUGGESTIONS: "SET_DEST_SUGGESTIONS",
  SHOW_DEPART_DROPDOWN: "SHOW_DEPART_DROPDOWN",
  SHOW_DEST_DROPDOWN: "SHOW_DEST_DROPDOWN",
  SET_STEP: "SET_STEP",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
};

// Reducer qui applique les mises à jour d'état du formulaire
function reducer(state, action) {
  switch (action.type) {
    // Met à jour un champ spécifique (depart/destination/date)
    case actionTypes.SET_FIELD:
      return { ...state, [action.field]: action.value };
    // Réinitialise le formulaire à l'état initial
    case actionTypes.RESET:
      return { ...initialState, campuses: state.campuses };
    // Démarre la soumission (met loading = true)
    case actionTypes.SUBMIT_START:
      return { ...state, loading: true, error: null };
    // Termine la soumission (met loading = false)
    case actionTypes.SUBMIT_END:
      return { ...state, loading: false };
    // Définit un message d'erreur en cas d'échec
    case actionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.error };
    // Charge les données des campus
    case actionTypes.SET_CAMPUSES:
      return { ...state, campuses: action.payload };
    // Mise à jour de la requête de départ
    case actionTypes.SET_DEPART_QUERY:
      return { ...state, departQuery: action.payload };
    // Mise à jour de la requête de destination
    case actionTypes.SET_DEST_QUERY:
      return { ...state, destQuery: action.payload };
    // Mise à jour des suggestions de départ
    case actionTypes.SET_DEPART_SUGGESTIONS:
      return { ...state, departSuggestions: action.payload };
    // Mise à jour des suggestions de destination
    case actionTypes.SET_DEST_SUGGESTIONS:
      return { ...state, destSuggestions: action.payload };
    // Afficher/masquer le dropdown de départ
    case actionTypes.SHOW_DEPART_DROPDOWN:
      return { ...state, showDepartDropdown: action.payload };
    // Afficher/masquer le dropdown de destination
    case actionTypes.SHOW_DEST_DROPDOWN:
      return { ...state, showDestDropdown: action.payload };
    // Changer l'étape du formulaire
    case actionTypes.SET_STEP:
      return { ...state, step: action.payload };
    // Stocker les résultats de recherche
    case actionTypes.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
}

// Provider qui expose l'état et les helpers aux composants enfants
export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Helper pour mettre à jour un champ
  const setField = (field, value) =>
    dispatch({ type: actionTypes.SET_FIELD, field, value });

  // Réinitialiser le formulaire
  const resetForm = () => dispatch({ type: actionTypes.RESET });

  // Charger les campus depuis le fichier JSON
  const loadCampuses = async () => {
    try {
      const res = await fetch("src/data/universite.json");
      const data = await res.json();
      const u = data.universities_and_institutions || [];
      // Construire une liste plate de campus
      const flat = u.flatMap((uni) =>
        (uni.campuses || []).map((c) => ({ ...c, university: uni.name })),
      );
      dispatch({ type: actionTypes.SET_CAMPUSES, payload: flat });
    } catch (err) {
      console.error("Erreur lors du chargement des campus:", err);
      dispatch({ type: actionTypes.SET_CAMPUSES, payload: [] });
    }
  };

  // Récupérer un nom lisible pour un campus
  const getDisplayName = (obj) => {
    if (!obj) return "";
    if (obj.name && obj.university) return `${obj.name} — ${obj.university}`;
    return (
      obj.name || obj.nom || obj.university || obj.label || obj.title || ""
    );
  };

  // Filtrer les suggestions de campus
  const filterSuggestions = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return state.campuses
      .filter((c) => (c.name || "").toLowerCase().includes(q))
      .slice(0, 8);
  };

  // Gérer le changement du champ départ
  const handleDepartChange = (val) => {
    dispatch({ type: actionTypes.SET_DEPART_QUERY, payload: val });
    setField("depart", val);
    const results = filterSuggestions(val);
    dispatch({ type: actionTypes.SET_DEPART_SUGGESTIONS, payload: results });
    dispatch({
      type: actionTypes.SHOW_DEPART_DROPDOWN,
      payload: results.length > 0 && val.length > 0,
    });
  };

  // Gérer le changement du champ destination
  const handleDestChange = (val) => {
    dispatch({ type: actionTypes.SET_DEST_QUERY, payload: val });
    setField("destination", val);
    const results = filterSuggestions(val);
    dispatch({ type: actionTypes.SET_DEST_SUGGESTIONS, payload: results });
    dispatch({
      type: actionTypes.SHOW_DEST_DROPDOWN,
      payload: results.length > 0 && val.length > 0,
    });
  };

  // Sélectionner un campus pour le départ
  const selectDepart = (campus) => {
    const name = campus?.name || "";
    dispatch({ type: actionTypes.SET_DEPART_QUERY, payload: name });
    setField("depart", name);
    dispatch({ type: actionTypes.SHOW_DEPART_DROPDOWN, payload: false });
  };

  // Sélectionner un campus pour la destination
  const selectDest = (campus) => {
    const name = campus?.name || "";
    dispatch({ type: actionTypes.SET_DEST_QUERY, payload: name });
    setField("destination", name);
    dispatch({ type: actionTypes.SHOW_DEST_DROPDOWN, payload: false });
  };

  // Fermer les dropdowns
  const closeDropdowns = () => {
    dispatch({ type: actionTypes.SHOW_DEPART_DROPDOWN, payload: false });
    dispatch({ type: actionTypes.SHOW_DEST_DROPDOWN, payload: false });
  };

  // Changer l'étape du formulaire
  const setStep = (stepNumber) => {
    dispatch({ type: actionTypes.SET_STEP, payload: stepNumber });
  };

  // Soumettre le formulaire de manière asynchrone.
  // onSubmit est un callback optionnel passé par le composant appelant.
  const submitForm = async (onSubmit) => {
    dispatch({ type: actionTypes.SUBMIT_START });
    try {
      // Si on fournit un callback de soumission, on l'appelle
      if (typeof onSubmit === "function") {
        await onSubmit({ ...state });
      }
      // Marque la fin de la soumission
      dispatch({ type: actionTypes.SUBMIT_END });
    } catch (err) {
      // En cas d'erreur, on stocke le message d'erreur
      dispatch({
        type: actionTypes.SET_ERROR,
        error: err?.message || String(err),
      });
    }
  };

  // Rechercher des trajets via le service `trajetservice`.
  // overrides (optionnel) peut contenir depart/destination/date/heure.
  const searchTrajets = async (overrides = {}) => {
    dispatch({ type: actionTypes.SUBMIT_START });
    try {
      const params = {
        depart: overrides.depart ?? state.depart,
        destination: overrides.destination ?? state.destination,
        date: overrides.date ?? state.date,
        heure: overrides.heure ?? state.heure,
      };
      const results = await trajetService.searchTrajets(params);
      dispatch({ type: actionTypes.SET_SEARCH_RESULTS, payload: results });
      dispatch({ type: actionTypes.SUBMIT_END });
      console.log(results);
      
      return results;
    } catch (err) {
      dispatch({
        type: actionTypes.SET_ERROR,
        error: err?.message || String(err),
      });
      throw err;
    }
  };

  // Retourne un gestionnaire d'événement pour les inputs: (e) => setField(field, e.target.value)
  const getChangeHandler = (field) => (e) => setField(field, e.target.value);

  return (
    <FormContext.Provider
      value={{
        state,
        setField,
        resetForm,
        submitForm,
        searchTrajets,
        getChangeHandler,
        loadCampuses,
        getDisplayName,
        handleDepartChange,
        handleDestChange,
        selectDepart,
        selectDest,
        closeDropdowns,
        setStep,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte
export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx)
    throw new Error("useFormContext must be used within a FormProvider");
  return ctx;
};

export default FormContext;
