import express from "express";
import {
  createSingleDnsRecord,
  listDnsRecords,
} from "../controllers/Dnsrecord";
const router = express.Router();

router.get("/list/all/dns/records", listDnsRecords);
router.post("/create/single/dns/record", createSingleDnsRecord);

export default router;
