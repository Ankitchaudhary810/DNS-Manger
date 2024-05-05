import { ListResourceRecordSetsCommand } from "@aws-sdk/client-route-53";
import { Request, Response, NextFunction } from "express";
import aws_route53_client from "../utility";

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
