const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { isLoggedIn, isAdmin, checkId } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router
  .route("/")
  .post(isLoggedIn, wrapAsync(orderController.createOrder))
  .get(isLoggedIn, isAdmin, wrapAsync(orderController.getAllOrders));

router.route("/mine").get(isLoggedIn, wrapAsync(orderController.getUserOrders));
router.route("/total-orders").get(wrapAsync(orderController.countTotalOrders));

router
  .route("/total-sales") // this endpoint is for dashbord too => "/"
  .get(wrapAsync(orderController.countTotalSales));
router
  .route("/total-sales-by-date")
  .get(wrapAsync(orderController.calculateTotalSalesByDate));

router.route("/:id").get(isLoggedIn, wrapAsync(orderController.findOrderById));
router
  .route("/:id/pay")
  .put(isLoggedIn, wrapAsync(orderController.markOrderAsPaid));

router
  .route("/:id/deliver")
  .put(isLoggedIn, isAdmin, wrapAsync(orderController.markOrderAsDelivered));

module.exports = router;
