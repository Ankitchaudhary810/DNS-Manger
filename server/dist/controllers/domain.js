"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDomain = exports.listDomain = exports.isDomainExist = exports.createDomain = void 0;
const client_route_53_1 = require("@aws-sdk/client-route-53");
const utility_1 = __importDefault(require("../utility"));
const createDomain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method == "POST") {
        try {
            const domainNams = req.body;
            console.log(domainNams);
            const domainAlreadyExits = yield (0, exports.isDomainExist)();
            const dataLog = [];
            for (const domain in domainNams) {
                // TODO: NEED TO FIX THE TYPE
                // @ts-ignore
                const { Name } = domainNams[domain];
                const fullyQualifiedName = Name.endsWith(".") ? Name : `${Name}.`;
                if (domainAlreadyExits === null || domainAlreadyExits === void 0 ? void 0 : domainAlreadyExits.find((zone) => zone &&
                    zone.Name &&
                    (zone.Name.toLowerCase() === (Name + ".").toLowerCase() ||
                        zone.Name.toLowerCase() === fullyQualifiedName.toLowerCase()))) {
                    console.log(`Hosted zone '${fullyQualifiedName}' already exists. Skipping creation.`);
                    continue;
                }
                const params = {
                    Name: fullyQualifiedName,
                    CallerReference: `${Date.now()}`,
                    HostedZoneConfig: {
                        Comment: " ", // don't know what is thing
                        PrivateZone: false,
                    },
                };
                const command = new client_route_53_1.CreateHostedZoneCommand(params);
                const { HostedZone } = yield utility_1.default.send(command);
                dataLog.push(HostedZone === null || HostedZone === void 0 ? void 0 : HostedZone.Name);
            }
            if (dataLog.length === 0) {
                console.log("No domain is created");
            }
            res.status(200).json(dataLog);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.createDomain = createDomain;
const isDomainExist = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_route_53_1.ListHostedZonesCommand({});
    const { HostedZones } = yield utility_1.default.send(command);
    return HostedZones;
});
exports.isDomainExist = isDomainExist;
const listDomain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method == "GET") {
        try {
            const command = new client_route_53_1.ListHostedZonesCommand({});
            const { HostedZones } = yield utility_1.default.send(command);
            res.status(200).json(HostedZones);
        }
        catch (error) {
            console.error("Error while listing hosted zones ", error);
            throw error;
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.listDomain = listDomain;
const deleteDomain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method == "POST") {
        try {
            const domainNams = req.body;
            const domainAlreadyExits = yield (0, exports.isDomainExist)();
            const dataLog = [];
            for (const domain in domainNams) {
                // TODO: NEED TO FIX THE TYPE
                // @ts-ignore
                const { Name } = domainNams[domain];
                const fullyQualifiedName = Name.endsWith(".") ? Name : `${Name}.`;
                const domainExists = domainAlreadyExits === null || domainAlreadyExits === void 0 ? void 0 : domainAlreadyExits.find((zone) => zone &&
                    zone.Name &&
                    (zone.Name.toLowerCase() === (Name + ".").toLowerCase() ||
                        zone.Name.toLowerCase() === fullyQualifiedName.toLowerCase()));
                if (!domainExists) {
                    console.log(`Hosted zone '${fullyQualifiedName}' does not exists.`);
                    continue;
                }
                const params = {
                    Id: domainExists.Id,
                };
                const command = new client_route_53_1.DeleteHostedZoneCommand(params);
                yield utility_1.default.send(command);
                dataLog.push({ domain: Name, status: "Deleted" });
            }
            res.status(200).json(dataLog);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.deleteDomain = deleteDomain;
