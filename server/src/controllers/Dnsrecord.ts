import {
  ChangeAction,
  ChangeResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommandInput,
  ListResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";
import { Request, Response, NextFunction } from "express";
import aws_route53_client from "../utility";
import { default_TTL } from "../config";

export const listDnsRecords = async (req: Request, res: Response) => {
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

      const command = new ListResourceRecordSetsCommand(params);

      const dnsRecords = await aws_route53_client.send(command);

      res.json(dnsRecords.ResourceRecordSets);
    } catch (error) {
      console.error("Error getting dnsrecords ", error);
      res.status(500).json({ error: "Error getting dnsrecords" });
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const createSingleDnsRecord = async (req: Request, res: Response) => {
  if (req.method === "POST") {
    try {
      const { Name, Type, TTL, resourceRecords, HostedZoneId } = req.body;

      const params: ChangeResourceRecordSetsCommandInput = {
        HostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: "CREATE" as ChangeAction,
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

      const command = new ChangeResourceRecordSetsCommand(params);
      const response = await aws_route53_client.send(command);

      res.status(200).json({
        message: "DNS Record created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error while creating single DNS records: ", error);
      res
        .status(500)
        .json({ error: "Error while creating single DNS records" });
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};
