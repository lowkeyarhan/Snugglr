import express from "express";
import {
  getAllDomains,
  getDomainById,
  addDomain,
  updateDomain,
  deleteDomain,
  verifyEmailDomain,
} from "../controllers/domainController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/verify", verifyEmailDomain);
router.get("/", getAllDomains);
router.post("/", addDomain); // TEMPORARY: Made public for bootstrapping
router.get("/:id", authMiddleware, getDomainById);
router.put("/:id", authMiddleware, updateDomain);
router.delete("/:id", authMiddleware, deleteDomain);

export default router;
