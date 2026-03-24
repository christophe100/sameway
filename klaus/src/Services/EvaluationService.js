import api from "./api";

const evaluationService = {
  createEvaluation: async (evaluationData) => {
    try {
      const response = await api.post("/evaluations", evaluationData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la création de l'évaluation",
        }
      );
    }
  },

  canEvaluate: async (reservationId) => {
    try {
      const response = await api.get(
        `/evaluations/can-evaluate/${reservationId}`,
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la vérification d'éligibilité",
        }
      );
    }
  },

  getMyEvaluations: async () => {
    try {
      const response = await api.get("/evaluations/me");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors du chargement des évaluations",
        }
      );
    }
  },

  getGivenEvaluations: async () => {
    try {
      const response = await api.get("/evaluations/given");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors du chargement des évaluations données",
        }
      );
    }
  },
};

export default evaluationService;
