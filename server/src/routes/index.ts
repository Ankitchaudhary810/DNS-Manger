import express from "express";
const router = express.Router();

import { createDomain } from "../controllers/dns";

router.post("/domain/create", createDomain);

export default router;
