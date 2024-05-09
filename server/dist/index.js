"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const domain_1 = __importDefault(require("./routes/domain"));
const Dnsrecord_1 = __importDefault(require("./routes/Dnsrecord"));
const config_1 = require("./config");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "*",
    methods: "*",
}));
app.get("/", (req, res) => {
    res.send("DNS BACKEND WORKING....");
});
app.use("/api/v1", domain_1.default);
app.use("/api/v1", Dnsrecord_1.default);
(0, db_1.default)();
const port = config_1.PORT || 4000;
app.listen(port, () => {
    console.log("server is running at ", port);
});
