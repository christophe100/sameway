import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
} from "lucide-react";
import authservice from "../../klaus/src/Services/authservice";
import { useNavigate } from "react-router";

const Profil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Mettre à jour le profil via le service
      const response = await authservice.updateProfile(editForm);
      if (response.success) {
        setUserData(editForm);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
    }
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    authservice.logout();
    navigate("/");
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        // Récupérer l'utilisateur actuel depuis le localStorage
        const currentUser = authservice.getCurrentUser();

        if (!currentUser) {
          // Si pas d'utilisateur, rediriger vers login
          navigate("/login");
          return;
        }

        // Préparer les données avec valeurs par défaut
        const formattedUser = {
          name: currentUser.nom
            ? `${currentUser.nom.toLocaleUpperCase()} ${currentUser.prenom || ""}`.trim()
            : "Utilisateur",
          email: currentUser.email || "N/A",
          phone: currentUser.telephone || "Non renseigné",
          // city: currentUser.ville || "Non renseigné",
          // university: currentUser.universite || "Non renseigné",
          biographie: currentUser.biographie || "Aucune bio",
          rating: currentUser.note_moyenne || 5.0,
          trips: currentUser.trajets_count || 0,
          reviews: currentUser.avis_count || 0,
        };

        setUserData(formattedUser);
        setEditForm(formattedUser);
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] pt-20">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      ) : !userData ? (
        <div className="flex items-center justify-center h-screen text-white text-2xl">
          Profil non disponible. Veuillez vous connecter.
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="relative py-10 px-4 md:px-8 bg-[#172628b3] backdrop-blur-lg rounded-2xl md:max-w-4xl mx-auto mb-10 " >
            <div className="max-w-6xl mx-auto">
              {/* Profile Card Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start ">
                {/* Avatar Section */}
                <div className="md:col-span-1 flex justify-center ">
                  <div className="relative h-30 w-30 md:h-40 md:w-40 rounded-full bg-black flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {userData.name.charAt(0).toLocaleUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User Info Section */}
                <div className="md:col-span-2 text-white">
                  {!isEditing ? (
                    <>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        {userData.name}
                      </h1>
                      <p className="text-[#E0E0E0] text-lg mb-6 flex items-center gap-2">
                        {userData.email}
                      </p>
                      <p className="text-[#D0D0D0] mb-6 max-w-md">
                        {userData.biographie}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-6 mb-8 max-w-md">
                        <div className="bg-[#2121212f] backdrop-blur-sm rounded-lg p-2 text-center">
                          <p className="text-3xl font-bold">
                            {userData.rating}
                          </p>
                          <p className="text-sm text-[#B0B0B0]">Note moyenne</p>
                        </div>
                        <div className="bg-[#2121212f] backdrop-blur-sm rounded-lg p-2 text-center">
                          <p className="text-3xl font-bold">{userData.trips}</p>
                          <p className="text-sm text-[#B0B0B0]">Trajets</p>
                        </div>
                        <div className="bg-[#2121212f] backdrop-blur-sm rounded-lg p-2 text-center">
                          <p className="text-3xl font-bold">
                            {userData.reviews}
                          </p>
                          <p className="text-sm text-[#B0B0B0]">Avis</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col md:flex-row gap-4">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn bg-[#51898E] hover:bg-[#457a7f] text-white border-none flex items-center gap-2 shadow-lg"
                        >
                          <Edit className="w-5 h-5" />
                          Modifier le profil
                        </button>
                        <button
                          className="btn bg-white hover:bg-gray-100 text-[#2C5F63] border-none flex items-center gap-2 shadow-lg"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-5 h-5" />
                          Se déconnecter
                        </button>
                        <button className="btn bg-[#51898E] hover:bg-[#457a7f] text-white border-none flex items-center gap-2 shadow-lg" onClick={()=> navigate("/gerer-reservations")}> Mes reservations</button>
                      </div>
                    </>
                  ) : (
                    /* Editing Form */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full px-4 py-3 bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                        />
                      </div>

                      {/* Save/Cancel Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={handleSave}
                          className="btn btn-sm bg-[#51898E] hover:bg-[#457a7f] text-white border-none flex items-center gap-2 flex-1"
                        >
                          <Save className="w-5 h-5" />
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn btn-sm bg-gray-500 hover:bg-gray-600 text-white border-none flex items-center gap-2 flex-1"
                        >
                          <X className="w-5 h-5" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8 border-b border-[#ffffff2f]">
              {["info", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 md:px-4 font-semibold transition-all ${
                    activeTab === tab
                      ? "text-white border-b-2 border-[#51898E]"
                      : "text-[#B0B0B0] hover:text-white"
                  }`}
                >
                  {tab === "info" && "Informations"}
                  {tab === "security" && "Sécurité"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-[#2121212f] backdrop-blur-lg rounded-lg shadow-lg shadow-[#000000a8] p-6 md:p-10">
              {/* Info Tab */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="bg-[#172628] rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-6 h-6 text-[#51898E]" />
                        <h3 className="font-semibold">Email</h3>
                      </div>
                      <p className="text-[#D0D0D0]">{userData.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="bg-[#172628] rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-6 h-6 text-[#51898E]" />
                        <h3 className="font-semibold">Téléphone</h3>
                      </div>
                      <p className="text-[#D0D0D0]">{userData.phone}</p>
                    </div>
                    
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6 text-white">
                  <div className="bg-[#172628] rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Modifier le mot de passe
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Mot de passe actuel"
                        className="w-full px-4 py-3 bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      />
                      <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full px-4 py-3 bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      />
                      <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        className="w-full px-4 py-3 bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                      />
                      <button className="btn bg-[#51898E] hover:bg-[#457a7f] text-white border-none w-full md:w-auto shadow-lg">
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>

                  {/* <div className="bg-[#172628] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Authentification à deux facteurs
                </h3>
                <p className="text-[#B0B0B0] mb-4">
                  Renforcez la sécurité de votre compte
                </p>
                <button className="btn bg-[#2C5F63] hover:bg-[#1a3d40] text-white border-none shadow-lg">
                  Activer l'authentification 2FA
                </button>
              </div> */}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profil;
