import { useFormContext } from "../../context/FormContext";
import { useEffect, useRef } from "react";
import Input from "../Input";
import { Search } from "lucide-react";
import { motion } from "motion/react";

const RechercherForm = () => {
  const {
    state,
    loadCampuses,
    getDisplayName,
    handleDepartChange,
    handleDestChange,
    selectDepart,
    selectDest,
    submitForm,
    searchTrajets,
    closeDropdowns,
    getChangeHandler,
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
const handleSearch = async () => {
  await searchTrajets();
};
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch()
    console.log(state.searchResults)
    // onSubmit(state);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      onSubmit={handleFormSubmit}
      className="flex flex-col md:flex-row items-center justify-center w-96 md:w-4xl bg-[#212121] rounded-[20px] shadow-xl shadow-[#454545] gap-10 px-10 py-8"
      ref={wrapperRef}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
        {/* Champ Départ avec autocomplete */}
        <div className="w-full relative">
          <Input
            placeholder={"Départ"}
            value={state.departQuery}
            onchange={(e) => handleDepartChange(e.target.value)}
          />
          {state.showDepartDropdown && (
            <ul className="absolute z-50 left-0 right-0 bg-white rounded-md shadow-lg max-h-44 overflow-auto mt-2">
              {state.departSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => selectDepart(s)}
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
            value={state.destQuery}
            onchange={(e) => handleDestChange(e.target.value)}
          />
          {state.showDestDropdown && (
            <ul className="absolute z-50 left-0 right-0 bg-white rounded-md shadow-lg max-h-44 overflow-auto mt-2">
              {state.destSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => selectDest(s)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {getDisplayName(s)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Champ Date */}
        <Input
          placeholder={"jj/mm/aaaa"}
          type={"date"}
          value={state.date}
          onchange={getChangeHandler("date")}
        />
      </div>

      <button
        type="submit"
        className="btn md:w-60 w-full bg-[#51898E] text-white rounded-lg  shadow-lg shadow-black border-none hover:scale-102 hover:bg-[#457a7f] transition-all"
      >
        <Search className="mr-2 " /> Rechercher
      </button>
    </motion.form>
  );
};

export default RechercherForm;
