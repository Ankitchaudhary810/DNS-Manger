"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const domain_1 = require("../controllers/domain");
router.post("/domain/create", domain_1.createDomain);
router.get("/domain/list", domain_1.listDomain);
router.post("/domain/delete", domain_1.deleteDomain);
exports.default = router;
