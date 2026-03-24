import Input from "../components/Input";
import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import authService from "../../backend/src/Services/authservice";

const Register = () => {
  const style = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    outline: "none",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [num, setNum] = useState("");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = ["Identité", "Contact", "Sécurité"];

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!name.trim()) e.name = "Le nom est requis";
      if (!prenom.trim()) e.prenom = "Le prénom est requis";
    }
    if (s === 1) {
      if (!email.trim()) e.email = "L'email est requis";
      if (!num) e.num = "Le numéro est requis";
    }
    if (s === 2) {
      if (!password) e.password = "Le mot de passe est requis";
      if (password !== confirmPassword)
        e.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (validateStep(step)) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handlePrev = (e) => {
    e && e.preventDefault && e.preventDefault();
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setServerError(null);
    setLoading(true);

    try {
      const tel = (num || "").replace(/\D/g, "");
      const payload = {
        nom: name,
        prenom: prenom,
        email,
        password,
        telephone: tel,
      };
      const res = await authService.register(payload);

      if (res?.success && res.token) {
        navigate("/login");
      } else {
        setServerError(res?.message || "Erreur inconnue");
      }
    } catch (err) {
      setServerError(err?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-30 h-screen">
      <div className=" flex flex-col items-center justify-center gap-5 w-full">
        <h1 className="text-3xl font-bold mb-6">Inscription</h1>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col items-center justify-center w-96 md:w-1/3 bg-[#51898E] rounded-lg shadow-xl gap-5 p-6"
        >
          <div className="w-full mb-2 flex justify-between items-center">
            <div className="text-white font-semibold">
              Inscription - Étape {step + 1} / {steps.length}
            </div>
            <div className="flex gap-2">
              {steps.map((s, i) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${i <= step ? "bg-white" : "bg-gray-400"}`}
                />
              ))}
            </div>
          </div>

          {step === 0 && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Input
                label={"Nom"}
                type={"text"}
                placeholder={"Entrer votre nom "}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <div className="text-red-600 text-sm">{errors.name}</div>
              )}
              <Input
                label={"Prénom"}
                type={"text"}
                placeholder={"Entrer votre prénom "}
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              {errors.prenom && (
                <div className="text-red-600 text-sm">{errors.prenom}</div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Input
                label={"Email"}
                type={"email"}
                placeholder={"Entrer votre email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="text-red-600 text-sm">{errors.email}</div>
              )}
              <div className="w-full mt-2">
                <label htmlFor="phone" className="block mb-2 text-white">
                  Numéro de téléphone
                </label>
                <PhoneInput
                  style={style}
                  defaultCountry="TG"
                  value={num}
                  onChange={setNum}
                  placeholder="Entrez votre numéro"
                />
                {errors.num && (
                  <div className="text-red-600 text-sm">{errors.num}</div>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Input
                label={"Mot de passe"}
                type={"password"}
                placeholder={"Entrer votre mot de passe"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <div className="text-red-600 text-sm">{errors.password}</div>
              )}
              <Input
                label={"Confirmer le mot de passe"}
                type={"password"}
                placeholder={"Confirmer votre mot de passe"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <div className="text-red-600 text-sm">
                  {errors.confirmPassword}
                </div>
              )}
            </motion.div>
          )}

          <div className="w-full flex gap-3 mt-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className=" btn w-1/2 bg-white text-[#2C5F63] border-none shadow-lg py-2 px-4 rounded-lg hover:opacity-90 transition duration-200"
              >
                Précédent
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className={` btn ${step > 0 ? "w-1/2" : "w-full"} text-white bg-[#2C5F63] border-none shadow-lg py-2 px-4 rounded-lg hover:bg-[#1a3d40] transition duration-300`}
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className=" btn w-1/2 text-white bg-[#2C5F63] border-none shadow-lg py-2 px-4 rounded-lg hover:bg-[#1a3d40] transition duration-300"
              >
                S'inscrire
              </button>
            )}
          </div>
        </form>
        <div>
          <span>Pas de compte ? </span>
          <Link
            to="/login"
            className=" text-sm font-bold text-[#51898E] hover:text-gray-800 transition duration-300"
          >
            Connectez-vous
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Register;
