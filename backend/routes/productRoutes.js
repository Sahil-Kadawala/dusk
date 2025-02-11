const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin, checkId } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const productController = require("../controllers/productController");
const formidable = require("express-formidable");

router
  .route("/")
  .get(wrapAsync(productController.getProducts)) // 6 products
  .post(
    isLoggedIn,
    isAdmin,
    formidable(),
    wrapAsync(productController.addProduct)
  );

router.route("/allProducts").get(productController.getAllProducts);

router.get("/top", wrapAsync(productController.getTopProduct));
router.get("/new", wrapAsync(productController.getNewProduct));

router
  .route("/:id")
  .get(wrapAsync(productController.getProductById))
  .put(
    isLoggedIn,
    isAdmin,
    checkId,
    formidable(),
    wrapAsync(productController.updateProduct)
  )
  .delete(isLoggedIn, isAdmin, wrapAsync(productController.deleteProduct));

module.exports = router;
