import { Router } from "express";
import locationRoutes from "./location.routes";
import vendorCategoryRoutes from "./vendorcategory.routes";
import vendorTypeRoutes from "./vendortype.routes";

const router = Router();

router.use(locationRoutes);
router.use(vendorTypeRoutes);
router.use(vendorCategoryRoutes);

export default router;
