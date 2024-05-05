import express from "express";
const router = express.Router();

import { createDomain, listDomain } from "../controllers/dns";

router.post("/domain/create", createDomain);
router.get("/domain/list", listDomain);

export default router;
