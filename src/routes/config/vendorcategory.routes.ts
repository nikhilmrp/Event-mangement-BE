import vendorCategoryController from "@controllers/config/vendorcategory.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validate.middleware";
import { createVendorCategorySchema } from "@validators/config/vendorcategory.validator";
import { Router } from "express";

const router = Router();

router.post(
  "/create-vendor-category",
  authenticate,
  validate(createVendorCategorySchema),
  vendorCategoryController.createVendorCategory,
);

router.get("/get-vendor-catogories-by-vendor-type-id/:vendor_type_id", authenticate, vendorCategoryController.getVendorCategoriesByVendorTypeId);

export default router;  
