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
exports.isExistingDnsRecords = exports.updateDnsRecords = exports.createMultipleDnsRecord = exports.DeleteDnsRecord = exports.createSingleDnsRecord = exports.listDnsRecords = void 0;
const client_route_53_1 = require("@aws-sdk/client-route-53");
const utility_1 = __importDefault(require("../utility"));
const config_1 = require("../config");
const listDnsRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "GET") {
        try {
            const { HostedZoneId } = req.query;
            if (typeof HostedZoneId !== "string") {
                return res
                    .status(400)
                    .json({ error: "HostedZoneId must be a string." });
            }
            //   HostedZoneId name should be same not Id
            const params = {
                HostedZoneId,
            };
            const command = new client_route_53_1.ListResourceRecordSetsCommand(params);
            const dnsRecords = yield utility_1.default.send(command);
            res.json(dnsRecords.ResourceRecordSets);
        }
        catch (error) {
            console.error("Error getting dnsrecords ", error);
            res.status(500).json({ error: "Error getting dnsrecords" });
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.listDnsRecords = listDnsRecords;
const createSingleDnsRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "POST") {
        try {
            const { Name, Type, TTL, resourceRecords, HostedZoneId } = req.body;
            const params = {
                HostedZoneId,
                ChangeBatch: {
                    Changes: [
                        {
                            Action: "CREATE",
                            ResourceRecordSet: {
                                Name,
                                Type,
                                TTL,
                                ResourceRecords: [
                                    {
                                        Value: resourceRecords[0].Value,
                                    },
                                ],
                            },
                        },
                    ],
                },
            };
            const command = new client_route_53_1.ChangeResourceRecordSetsCommand(params);
            const response = yield utility_1.default.send(command);
            res.status(200).json({
                message: "DNS Record created successfully",
                data: response,
            });
        }
        catch (error) {
            console.error("Error while creating single DNS records: ", error);
            res
                .status(500)
                .json({ error: "Error while creating single DNS records" });
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.createSingleDnsRecord = createSingleDnsRecord;
const DeleteDnsRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "POST") {
        try {
            const dnsRecords = req.body;
            const { HostedZoneId } = req.query;
            if (!HostedZoneId) {
                return res.status(400).json({ error: "HostedZoneId is required" });
            }
            let anyDeleted = false;
            for (const dnsRecord of dnsRecords) {
                const existingDnsRecords = yield (0, exports.isExistingDnsRecords)(dnsRecord.Name, dnsRecord.Type, HostedZoneId);
                console.log({ existingDnsRecords });
                if (existingDnsRecords && existingDnsRecords.length > 0) {
                    for (const record of existingDnsRecords) {
                        if (record.Type === "NS" || record.Type === "SOA") {
                            console.log("Attempted to delete NS record at the apex of the domain, which is not allowed.");
                            continue;
                        }
                        const deleteCommand = new client_route_53_1.ChangeResourceRecordSetsCommand({
                            HostedZoneId: HostedZoneId,
                            ChangeBatch: {
                                Changes: [
                                    {
                                        Action: "DELETE",
                                        ResourceRecordSet: record,
                                    },
                                ],
                            },
                        });
                        yield utility_1.default.send(deleteCommand);
                        console.log("Record deleted: ", dnsRecord);
                        anyDeleted = true;
                    }
                }
                else {
                    console.log("No matching records found to delete for: ", dnsRecord);
                }
            }
            if (anyDeleted) {
                res.status(200).json({ msg: "DNS records deleted successfully." });
            }
            else {
                res
                    .status(404)
                    .json({ msg: "No matching DNS records found for deletion." });
            }
        }
        catch (error) {
            console.error("Error while deleting DNS records: ", error);
            res.status(500).json({ error: "Error while deleting DNS records" });
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.DeleteDnsRecord = DeleteDnsRecord;
const createMultipleDnsRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "POST") {
        try {
            const dnsRecords = req.body;
            const { HostedZoneId } = req.query;
            if (typeof HostedZoneId !== "string") {
                return res
                    .status(400)
                    .json({ error: "HostedZoneId must be a string." });
            }
            const changeSet = {
                Changes: [
                    {
                        Action: "CREATE",
                        ResourceRecordSet: {
                            Name: dnsRecords.Name,
                            Type: dnsRecords.Type,
                            TTL: dnsRecords.TTL || config_1.default_TTL,
                            ResourceRecords: dnsRecords.ResourceRecords.map((value) => ({
                                Value: value.Value,
                            })),
                        },
                    },
                ],
            };
            const params = {
                HostedZoneId,
                ChangeBatch: changeSet,
            };
            //@ts-ignore
            const command = new client_route_53_1.ChangeResourceRecordSetsCommand(params);
            const response = yield utility_1.default.send(command);
            res.status(200).json({
                message: "multiple DNS Record created successfully",
                data: response,
            });
        }
        catch (error) {
            console.error("Error while creating multiple DNS records: ", error);
            res
                .status(500)
                .json({ error: "Error while creating multiple DNS records" });
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.createMultipleDnsRecord = createMultipleDnsRecord;
const updateDnsRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === "POST") {
        try {
            const dnsRecords = req.body;
            const { HostedZoneId } = req.query;
            if (typeof HostedZoneId !== "string") {
                return res
                    .status(400)
                    .json({ error: "HostedZoneId must be a string." });
            }
            for (const record of dnsRecords) {
                const existingRecords = yield (0, exports.isExistingDnsRecords)(record.Name, record.Type, HostedZoneId);
                console.log({ existingRecords });
                if (existingRecords && existingRecords.length > 0) {
                    const ChangeBatch = {
                        HostedZoneId,
                        ChangeBatch: {
                            Changes: [
                                {
                                    Action: "UPSERT",
                                    ResourceRecordSet: {
                                        Name: record.Name,
                                        Type: record.Type,
                                        TTL: record.TTL || config_1.default_TTL,
                                        ResourceRecords: record.ResourceRecords.map((value) => ({
                                            Value: value.Value,
                                        })),
                                    },
                                },
                            ],
                        },
                    };
                    const params = {
                        HostedZoneId,
                        ChangeBatch: ChangeBatch,
                    };
                    // @ts-ignore
                    const command = new client_route_53_1.ChangeResourceRecordSetsCommand(params);
                    yield utility_1.default.send(command);
                    console.log("Record updated successfully:", record);
                }
                else {
                    console.log("No matching records found to update for:", record);
                }
            }
            res
                .status(200)
                .json({ message: "DNS Record updates attempted successfully." });
        }
        catch (error) {
            console.error("Error while updating DNS records:", error);
            res.status(500).json({ error: "Error while updating DNS records" });
        }
    }
    else {
        res.status(405).json({ error: `${req.method} Method not allowed` });
    }
});
exports.updateDnsRecords = updateDnsRecords;
const isExistingDnsRecords = (name, type, HostedZoneId) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedName = name.endsWith(".") ? name : `${name}.`;
    const command = new client_route_53_1.ListResourceRecordSetsCommand({
        HostedZoneId,
        MaxItems: 100,
        StartRecordName: formattedName,
        StartRecordType: type,
    });
    const { ResourceRecordSets } = yield utility_1.default.send(command);
    return ResourceRecordSets === null || ResourceRecordSets === void 0 ? void 0 : ResourceRecordSets.filter((record) => {
        var _a;
        return ((_a = record === null || record === void 0 ? void 0 : record.Name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === formattedName.toLowerCase() &&
            record.Type === type;
    });
});
exports.isExistingDnsRecords = isExistingDnsRecords;
