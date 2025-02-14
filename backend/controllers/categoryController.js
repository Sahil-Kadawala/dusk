const Category = require("../models/category");

module.exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body.category;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body.category;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.json({ error: "category not found" });
    } else if (category.name === name) {
      return res.json({ error: "Enter new name" });
    }
    category.name = name;
    const updatedCategory = await category.save();
    return res.json(updatedCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    res.json({ deleted: deletedCategory });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports.listCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({});
    res.json({ allCategories: allCategories });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports.readCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({ category });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
