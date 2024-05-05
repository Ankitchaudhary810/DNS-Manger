import express from "express";
import { listDnsRecords } from "../controllers/Dnsrecord";
const router = express.Router();

router.get("/list/all/dns/records", listDnsRecords);

export default router;
