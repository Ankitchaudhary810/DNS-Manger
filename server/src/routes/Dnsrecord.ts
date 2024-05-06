import express from "express";
import {
  createSingleDnsRecord,
  listDnsRecords,
  DeleteDnsRecord,
  createMultipleDnsRecord,
} from "../controllers/Dnsrecord";
const router = express.Router();

router.get("/list/all/dns/records", listDnsRecords);
router.post("/create/single/dns/record", createSingleDnsRecord);
router.post("/delete/dns/record", DeleteDnsRecord);
router.post("/create/multiple/dns/record", createMultipleDnsRecord);

export default router;
