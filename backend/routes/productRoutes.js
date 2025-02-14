const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin, checkId } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const productController = require("../controllers/productController");
const formidable = require("express-formidable");
const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router
  .route("/")
  .get(wrapAsync(productController.getProducts)) // 6 products
  .post(
    isLoggedIn,
    isAdmin,
    upload.single("product[image]"),
    wrapAsync(productController.addProduct)
  );

router.route("/allProducts").get(productController.getAllProducts);

router.get("/top", wrapAsync(productController.getTopProduct));
router.get("/new", wrapAsync(productController.getNewProduct));
router.route("/filtered-products").post(productController.filterProducts);

router
  .route("/:id")
  .get(wrapAsync(productController.getProductById))
  .put(
    isLoggedIn,
    isAdmin,
    checkId,
    upload.single("product[image]"),
    wrapAsync(productController.updateProduct)
  )
  .delete(isLoggedIn, isAdmin, wrapAsync(productController.deleteProduct));

module.exports = router;
