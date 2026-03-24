const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadProfilePhoto } = require("../controllers/Uploadcontroller");

/**
 * ROUTES D'UPLOAD
 *
 * Toutes les routes commencent par /api/upload
 *
 * Routes protégées (nécessitent un token) :
 *   - POST /api/upload/profile-photo  → Uploader une photo de profil
 */

/**
 * @route   POST /api/upload/profile-photo
 * @desc    Upload une photo de profil
 * @access  Private
 *
 * Body : FormData avec clé 'photo'
 * Fichier acceptés : jpeg, jpg, png, gif, webp (max 5MB)
 *
 * Réponse :
 * {
 *   "success": true,
 *   "message": "Photo de profil mise à jour avec succès",
 *   "photo": "user-xxx-xxx.jpg",
 *   "photoUrl": "/uploads/user-xxx-xxx.jpg"
 * }
 */
router.post("/profile-photo", protect, uploadProfilePhoto);

module.exports = router;
