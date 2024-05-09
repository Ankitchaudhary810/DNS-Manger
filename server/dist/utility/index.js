"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_route_53_1 = require("@aws-sdk/client-route-53");
const config_1 = require("../config");
const aws_route53_client = new client_route_53_1.Route53Client({
    region: config_1.region,
    credentials: {
        accessKeyId: config_1.aws_access_key,
        secretAccessKey: config_1.aws_secret_key,
    },
});
exports.default = aws_route53_client;
