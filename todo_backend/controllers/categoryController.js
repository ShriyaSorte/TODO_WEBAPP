const categorymodel = require("../models/categoryModel");

async function createCategory(req, res) {
  console.log(req.body);
  const userid = req.user._id;
  const { categoryName, createdBy, createdAt } = req.body;
  try {
    const existingcategory = await categorymodel.findOne({ categoryName });
    if (existingcategory) {
      return res.status(400).send({ message: "Category Already Exists" });
    } else {
      const newcategory = new categorymodel({
        categoryName,
        createdBy: req.user.id,
        createdAt: Date.now(),
      });
      await newcategory.save();
      res.status(201).send({ message: "Category Added Sucessfully" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getCategoryById(req, res) {
  console.log(req.body);
  const { id } = req.params;
  try {
    const category = await categorymodel.findById(id);
    console.log(id);
    if (!category) {
      res.status(404).send({ msg: "category id is not found" });
    }
    return res.status(201).send({
      categoryName: category.categoryName,
      createdBy: category.createdBy,
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getAllCategories(req, res) {
  try {
    const category = await categorymodel.find();
    res.status(201).send({ category: category });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function updateCategory(req, res) {
  console.log(req.body);
  const { categoryName, createdBy } = req.body;
  const { id } = req.params;

  try {
    const category = await categorymodel.findByIdAndUpdate(id);
    if (!category) {
      res.status(404).send({ message: "Category Not Found" });
    }
    category.categoryName = categoryName || category.categoryName;
    category.createdBy = createdBy || category.createdBy;
    await category.save();
    res.status(201).send({ message: "Category Updated Sucessfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deleteCategory(req, res) {
  console.log(req.body);
  const { id } = req.params;
  try {
    const category = await categorymodel.findByIdAndDelete(id);
    if (!category) {
      res.status(404).send({ message: "Category Not Found" });
    }
    res.status(201).send({ message: "Category Deleted Sucessfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
