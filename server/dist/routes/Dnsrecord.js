"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Dnsrecord_1 = require("../controllers/Dnsrecord");
const router = express_1.default.Router();
router.get("/list/all/dns/records", Dnsrecord_1.listDnsRecords);
router.post("/create/single/dns/record", Dnsrecord_1.createSingleDnsRecord);
router.post("/delete/dns/record", Dnsrecord_1.DeleteDnsRecord);
router.post("/create/multiple/dns/record", Dnsrecord_1.createMultipleDnsRecord);
router.post("/update/dns/records", Dnsrecord_1.updateDnsRecords);
exports.default = router;
