import { LocateFixedIcon, Search } from "lucide-react";
import { useNavigate } from "react-router";
import Input from "./Input";
import { useFormContext } from "../context/FormContext";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import trajetService from "../../klaus/src/Services/trajetservice";

const RechercherForm = () => {
  const {
    state,
    getChangeHandler,
    submitForm,
    loadCampuses,
    getDisplayName,
    handleDepartChange,
    handleDestChange,
    selectDepart,
    selectDest,
    closeDropdowns,
  } = useFormContext();
  const navigate = useNavigate();
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      onSubmit={(e) => {
        e.preventDefault();
        submitForm(() => {
          navigate("/rechercher");
        });
      }}
      className=" flex flex-col items-center 
      justify-center w-96 md:w-1/3  bg-[rgba(0,0,0,0.28)] backdrop-blur-sm
       rounded-[20px] shadow-xl shadow-[#454545] h-96 gap-10 p-10  "
      ref={wrapperRef}
    >
      <div className="flex flex-col items-center justify-center gap-2 w-full">
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
        className="btn btn-lg bg-[#51898E] rounded-lg w-full shadow-lg text-white shadow-black border-none hover:scale-102 hover:bg-[#457a7f] transition-all"
      >
        <Search /> Rechercher
      </button>
    </motion.form>
  );
};

export default RechercherForm;
