"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dns_1 = require("../controllers/dns");
router.post("/domain/create", dns_1.createDomain);
router.get("/domain/list", dns_1.listDomain);
router.post("/domain/delete", dns_1.deleteDomain);
exports.default = router;
