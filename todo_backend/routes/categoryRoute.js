const express = require("express");
const categoryController = require("../controllers/categoryController");
const { auth } = require("../middlewares/authorize");
const router = express.Router();

router.post("/createCategory", auth, categoryController.createCategory);
router.get("/getCategoryById/:id", auth, categoryController.getCategoryById);
router.get("/getAllCategories", auth, categoryController.getAllCategories);
router.put("/updateCategory/:id", auth, categoryController.updateCategory);
router.delete("/deleteCategory/:id", auth, categoryController.deleteCategory);

module.exports = router;

// http://localhost:4001/api/category/createCategory
// http://localhost:4001/api/category/getAllCategories
// http://localhost:4001/api/category/getCategoryById/66e699a841a0dcbe18b011b4
// http://localhost:4001/api/category/updateCategory/66e699a841a0dcbe18b011b4
// http://localhost:4001/api/category/deleteCategory/66e69a0803355d68b4e349c2
