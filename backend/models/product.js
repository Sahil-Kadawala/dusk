const mongoose = require("mongoose");
const { Schema } = mongoose;
const { cloudinary } = require("../config/cloudConfig");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      url: String,
      filename: String,
    },
  },
  { timestamps: true }
);

productSchema.post("findOneAndDelete", async (product) => {
  if (product) {
    if (product.reviews && product.reviews.length) {
      await Review.deleteMany({ _id: { $in: product.reviews } });
    }
    if (product.image && product.image.filename) {
      await cloudinary.uploader.destroy(product.image.filename);
    }
  }
});

module.exports = mongoose.model("Product", productSchema);
