const Product = require("../models/product");
const { cloudinary } = require("../config/cloudConfig");

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, countInStocks } =
      req.body.product;

    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !countInStocks:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
      case !req.file:
        return res.json({ error: "Image is required" });
    }

    const { path: url, filename } = req.file;

    const product = new Product({ ...req.body.product });
    product.image = { url, filename };

    await product.save();
    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, countInStocks } =
      req.body.product;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !countInStocks:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body.product },
      { new: true }
    );

    if (req.file) {
      const { path: url, filename } = req.file;

      if (product.image && product.image.filename) {
        await cloudinary.uploader.destroy(product.image.filename);
      }
      product.image = { url, filename };
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate({
        path: "reviews",
        options: { strictPopulate: false },
      });
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate({
        path: "reviews",
        options: { strictPopulate: false },
      })
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports.getTopProduct = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewDetails",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviewDetails.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 4,
      },
    ]);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to retrieve top products" });
  }
};

module.exports.getNewProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

module.exports.filterProducts = async (req, res) => {
  try {
    const { checked, radio } = req.body; // checked is an array of Category id that user wants to filter by
    // and radio is array of 2 element representing max and min price range
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
