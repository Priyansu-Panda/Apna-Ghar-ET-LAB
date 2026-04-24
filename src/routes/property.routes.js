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
router.get("/properties", authMiddleware.authUser, propertyController.getAllProperties);
router.get("/properties/:id",authMiddleware.authUser, propertyController.getAllPropertiesById);

// router.post("/apiproperties", authMiddleware.authOwner, upload.array("images", 10), createPropertyValidator, propertyController.createProperty)
router.post("/properties", authMiddleware.authOwner, upload.array("images", 10), propertyController.createProperty)

// router.post("/apiproperties", authMiddleware.authOwner, upload.single("images"), propertyController.createProperty)
// router.post("/properties/:id",)

router.put("/properties/:id",authMiddleware.authOwner, upload.single("images"), propertyController.updatePropertyById)
// router.put("/properties/:id",authMiddleware.authOwner, upload.single("images"), updatePropertyValidator, propertyController.updatePropertyById)
router.delete("/properties/:id", authMiddleware.authOwner, propertyController.deletePropertyById)

module.exports = router;
