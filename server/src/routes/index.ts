import express from "express";
const router = express.Router();

import { createDomain, deleteDomain, listDomain } from "../controllers/dns";

router.post("/domain/create", createDomain);
router.get("/domain/list", listDomain);
router.post("/domain/delete", deleteDomain);

export default router;
