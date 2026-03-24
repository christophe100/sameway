import api from "./api";

const UploadService = {
  /**
   * Upload une photo de profil
   * @param {File} file - Le fichier image à uploader
   * @returns {Promise} - Réponse du serveur avec URL de la photo
   */
  uploadProfilePhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.post("/upload/profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur lors de l'upload de la photo",
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export default UploadService;
