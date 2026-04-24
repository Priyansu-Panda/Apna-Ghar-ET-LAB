const express = require("express");
const propertyController = require("../controllers/property.controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createPropertyValidator, updatePropertyValidator } = require("../middleware/validator.middleware");
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})


// router.get("/dashboard", )
router.get("/api/properties", authMiddleware.authUser, propertyController.getAllProperties);
router.get("/api/properties/:id",authMiddleware.authUser, propertyController.getAllPropertiesById);

// router.post("/api/properties", authMiddleware.authOwner, upload.array("images", 10), createPropertyValidator, propertyController.createProperty)
router.post("/api/properties", authMiddleware.authOwner, upload.array("images", 10), propertyController.createProperty)

// router.post("/api/properties", authMiddleware.authOwner, upload.single("images"), propertyController.createProperty)
// router.post("/api/properties/:id",)

router.put("/api/properties/:id",authMiddleware.authOwner, upload.single("images"), propertyController.updatePropertyById)
// router.put("/api/properties/:id",authMiddleware.authOwner, upload.single("images"), updatePropertyValidator, propertyController.updatePropertyById)
router.delete("/api/properties/:id", authMiddleware.authOwner, propertyController.deletePropertyById)

module.exports = router;
