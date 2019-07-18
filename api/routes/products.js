const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  //reject file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const ProductsController = require("../controllers/products");

router.get("/", ProductsController.products_get_all);
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
);
router.get("/:productId", ProductsController.products_get_product);

router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_product
);

module.exports = router;
