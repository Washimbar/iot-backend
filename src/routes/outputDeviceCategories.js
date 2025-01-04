const express = require("express");
const { v4: uuidv4 } = require('uuid');
const OutputDeviceCategories = require("../models/OutputDeviceCategories");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();

// Get all output device categories
router.get("/", async (req, res) => {
  try {
    const categories = await OutputDeviceCategories.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get output device category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await OutputDeviceCategories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new output device category
router.post("/", isAdmin, async (req, res) => {
  try {
    const {
      categoryName,
      categoryType,
      minValue,
      maxValue,
      currentValue,
      unit,
      description,
    } = req.body;


    const newCategory = new OutputDeviceCategories({
      categoryName,
      categoryType,
      minValue,
      maxValue,
      currentValue,
      unit,
      description,
    });

    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update output device category
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const {
      categoryName,
      categoryType,
      minValue,
      maxValue,
      currentValue,
      unit,
      description,
    } = req.body;

    const category = await OutputDeviceCategories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (categoryName) category.categoryName = categoryName;
    if (categoryType) category.categoryType = categoryType;
    if (minValue) category.minValue = minValue;
    if (maxValue) category.maxValue = maxValue;
    if (currentValue) category.currentValue = currentValue;
    if (unit) category.unit = unit;
    if (description) category.description = description;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete output device category
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const category = await OutputDeviceCategories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.remove();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create bulk output device categories
router.post("/bulk-upload", isAdmin, async (req, res) => {
  try {
    const categories = req?.body?.data; // Array of categories

    if (!Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input, array of categories required" });
    }

    const result = [];
    const errors = [];

    // Insert categories one by one
    for (const [index, category] of categories.entries()) {
      try {
        if (!category.categoryName || !category.categoryType ||!category.unit || !category.categoryType) {
          throw new Error("categoryName and categoryType are required");
        }

        const newCategory = new OutputDeviceCategories(category);
        const savedCategory = await newCategory.save();
        result.push(savedCategory); // Add to success list
      } catch (err) {
        errors.push({
          categoryIndex: index,
          categoryData: category,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      message: `${result.length} categories were successfully uploaded.`,
      data: result,
      errors, // Return errors for categories that failed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
