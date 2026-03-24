import { useEffect, useState } from "react";
import {
  Camera,
  Edit,
  LogOut,
  Mail,
  Phone,
  Save,
  Settings,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import authservice from "../../backend/src/Services/authservice";
import UploadService from "../../backend/src/Services/UploadService";

const API_BASE_URL = "http://localhost:5000";

const formatUserData = (rawUser) => ({
  name: rawUser.nom
    ? `${rawUser.nom.toLocaleUpperCase()} ${rawUser.prenom || ""}`.trim()
    : "Utilisateur",
  email: rawUser.email || "N/A",
  phone: rawUser.telephone || "Non renseigné",
  biographie: rawUser.biographie || "Aucune bio",
  rating: rawUser.note_moyenne || 5.0,
  trips: rawUser.trajets_count || 0,
  reviews: rawUser.avis_count || 0,
});

const Profil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await authservice.updateProfile(editForm);
      if (response.success) {
        const nextUser = response.user
          ? formatUserData(response.user)
          : editForm;
        setUserData(nextUser);
        setEditForm(nextUser);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Erreur lors de la mise a jour:", err);
    }
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const response = await UploadService.uploadProfilePhoto(file);

      if (response.success) {
        setPhotoUrl(`${API_BASE_URL}${response.photoUrl}`);

        const currentUser = authservice.getCurrentUser();
        if (currentUser) {
          currentUser.photo = response.photoUrl.replace("/uploads/", "");
          localStorage.setItem("user", JSON.stringify(currentUser));
        }

        alert("Photo de profil mise a jour avec succes!");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert(error.message || "Erreur lors de l'upload de la photo");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleLogout = () => {
    authservice.logout();
    navigate("/");
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const currentUser = authservice.getCurrentUser();

        if (!currentUser) {
          navigate("/login");
          return;
        }

        const formattedUser = formatUserData(currentUser);
        setUserData(formattedUser);
        setEditForm(formattedUser);

        if (currentUser.photo && currentUser.photo !== "default-avatar.png") {
          setPhotoUrl(`${API_BASE_URL}/uploads/${currentUser.photo}`);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] pt-20">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      </div>
    );
  }

  if (!userData || !editForm) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] pt-20">
        <div className="flex items-center justify-center h-screen text-white text-2xl">
          Profil non disponible. Veuillez vous connecter.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#51898E] to-[#172628] pt-30">
      <div className="relative py-10 px-2 md:px-4 bg-[#172628b3] backdrop-blur-lg rounded-2xl md:max-w-4xl mx-auto mb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 flex justify-center">
              <div className="relative group h-30 w-30 md:h-40 md:w-40">
                <div className="absolute inset-0 rounded-full bg-black flex items-center justify-center overflow-hidden ring-4 ring-[#51898E]">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-white">
                      {userData.name.charAt(0).toLocaleUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("photo-input")?.click()
                  }
                  disabled={uploadingPhoto}
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <Camera className="w-12 h-12 text-white" />
                </button>

                <input
                  id="photo-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />

                {uploadingPhoto && (
                  <div className="absolute inset-0 rounded-full bg-black/75 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 text-white space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {userData.name}
                </h1>
                <div className="flex items-center gap-2 text-[#D0D0D0]">
                  <User className="w-4 h-4 text-[#51898E]" />
                  <span>{userData.biographie}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="btn btn-sm shadow-sm shadow-black bg-[#51898E] hover:bg-[#457a7f] text-white border-none flex items-center gap-2"
                  >
                    {isEditing ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Edit className="w-4 h-4" />
                    )}
                    {isEditing ? "Fermer" : "Modifier"}
                  </button>
                  <button
                    onClick={() => navigate("/gerer-reservations")}
                    className="btn btn-sm shadow-sm shadow-black bg-[#2C5F63] hover:bg-[#1a3d40] text-white border-none flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Reservations
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm  shadow-sm shadow-black bg-[#ff0000a7] hover:bg-[#6f2e2e] text-white border-none flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Deconnexion
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="bg-[#2121212f] backdrop-blur-sm rounded-lg border border-[#51898E] p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 bg-[#2121212f] rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Bio
                    </label>
                    <textarea
                      name="biographie"
                      value={editForm.biographie}
                      onChange={handleEditChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-[#2121212f] rounded-lg border border-[#51898E] text-white placeholder-gray-400 focus:outline-none focus:border-white"
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
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

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
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
              {tab === "security" && "Securite"}
            </button>
          ))}
        </div>

        <div className="bg-[#2121212f] backdrop-blur-lg rounded-lg shadow-lg shadow-[#000000a8] p-6 md:p-10">
          {activeTab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#172628] rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-6 h-6 text-[#51898E]" />
                    <h3 className="font-semibold">Email</h3>
                  </div>
                  <p className="text-[#D0D0D0]">{userData.email}</p>
                </div>

                <div className="bg-[#172628] rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-6 h-6 text-[#51898E]" />
                    <h3 className="font-semibold">Telephone</h3>
                  </div>
                  <p className="text-[#D0D0D0]">{userData.phone}</p>
                </div>
              </div>
            </div>
          )}

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
                    Mettre a jour le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;
