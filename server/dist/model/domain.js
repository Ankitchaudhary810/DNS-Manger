"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsRecord = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RecordSchema = new mongoose_1.default.Schema({
    Value: {
        type: String,
        required: true,
    },
});
const dnsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    TTL: {
        type: Number,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    Records: {
        type: [RecordSchema],
        required: true,
    },
});
exports.DnsRecord = mongoose_1.default.model("dnsrecord", dnsSchema);
