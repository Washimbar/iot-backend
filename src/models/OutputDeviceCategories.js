const mongoose = require("mongoose");

const outputDeviceCategoriesSchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true, unique: true },
    categoryType: { type: String, required: true },
    minValue: { type: Number, required: false, default: 0 },
    maxValue: { type: Number, required: false, default: 0 },
    currentValue: { type: Number, required: false, default: 0 },
    unit: { type: String, required: true },
    description: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "OutputDeviceCategories",
  outputDeviceCategoriesSchema
);
