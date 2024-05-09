"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_TTL = exports.region = exports.aws_secret_key = exports.aws_access_key = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.aws_access_key = process.env.aws_access_key;
exports.aws_secret_key = process.env.aws_secret_key;
exports.region = process.env.region;
exports.default_TTL = 3600;
