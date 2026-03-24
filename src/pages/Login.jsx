import axios from "axios";
import Input from "../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: appeler l'API de connexion
    try {
      const base = "http://localhost:5000";
      const payload = {
        email,
        password,
      };

      const res = await axios.post(`${base}/api/auth/login`, payload, {
        withCredentials: true,
      });

      if (res.data?.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user || null));
        setSuccessMessage("Connexion réussie !");
        setTimeout(() => {
          location.reload(true);
        }, 1000);
        navigate("/profil");
      } else {
        setServerError(res.data?.message || "Erreur inconnue");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || "Erreur serveur",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-30">
      <div className=" flex flex-col items-center justify-center gap-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Connexion</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center justify-center w-96 md:w-1/3 bg-[#51898E] shadow-[#1a191980] rounded-lg shadow-xl gap-2 p-10"
        >
          {serverError ? (
            <div className="w-full bg-red-500 text-white p-3 rounded-lg text-sm">
              {serverError}
            </div>
          ) : successMessage ? (
            <div className="w-full bg-green-500 text-white p-3 rounded-lg text-sm">
              {successMessage}
            </div>
          ) : null}
          <Input
            label={"Email"}
            type={"email"}
            placeholder={"Entrer votre email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={"Mot de passe"}
            type={"password"}
            placeholder={"Entrer votre mot de passe"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className=" btn w-full text-white bg-[#2C5F63] border-none shadow-lg py-2 px-4 rounded-lg hover:bg-[#1a3d40] transition duration-300"
          >
            Se connecter
          </button>
        </form>
        <div>
          <span>Pas de compte ? </span>
          <Link
            to="/register"
            className=" text-sm font-bold text-[#51898E] hover:text-gray-800 transition duration-300"
          >
            Inscrivez-vous
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Login;
