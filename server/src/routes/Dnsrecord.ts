import express from "express";
import {
  createSingleDnsRecord,
  listDnsRecords,
  DeleteDnsRecord,
  createMultipleDnsRecord,
  updateDnsRecords,
} from "../controllers/Dnsrecord";
const router = express.Router();

router.get("/list/all/dns/records", listDnsRecords);
router.post("/create/single/dns/record", createSingleDnsRecord);
router.post("/delete/dns/record", DeleteDnsRecord);
router.post("/create/multiple/dns/record", createMultipleDnsRecord);
router.post("/update/dns/records", updateDnsRecords);

export default router;
