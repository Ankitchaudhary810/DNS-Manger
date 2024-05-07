import {
  ChangeAction,
  ChangeResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommandInput,
  ListResourceRecordSetsCommand,
  RRType,
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

export const DeleteDnsRecord = async (req: Request, res: Response) => {
  if (req.method === "POST") {
    try {
      const dnsRecords = req.body;
      const { HostedZoneId } = req.query;

      if (!HostedZoneId) {
        return res.status(400).json({ error: "HostedZoneId is required" });
      }

      let anyDeleted = false;

      for (const dnsRecord of dnsRecords) {
        const existingDnsRecords = await isExistingDnsRecords(
          dnsRecord.Name,
          dnsRecord.Type,
          HostedZoneId as string
        );

        console.log({ existingDnsRecords });

        if (existingDnsRecords && existingDnsRecords.length > 0) {
          for (const record of existingDnsRecords) {
            if (record.Type === "NS" || record.Type === "SOA") {
              console.log(
                "Attempted to delete NS record at the apex of the domain, which is not allowed."
              );
              continue;
            }
            const deleteCommand = new ChangeResourceRecordSetsCommand({
              HostedZoneId: HostedZoneId as string,
              ChangeBatch: {
                Changes: [
                  {
                    Action: "DELETE",
                    ResourceRecordSet: record,
                  },
                ],
              },
            });

            await aws_route53_client.send(deleteCommand);
            console.log("Record deleted: ", dnsRecord);
            anyDeleted = true;
          }
        } else {
          console.log("No matching records found to delete for: ", dnsRecord);
        }
      }

      if (anyDeleted) {
        res.status(200).json({ msg: "DNS records deleted successfully." });
      } else {
        res
          .status(404)
          .json({ msg: "No matching DNS records found for deletion." });
      }
    } catch (error) {
      console.error("Error while deleting DNS records: ", error);
      res.status(500).json({ error: "Error while deleting DNS records" });
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const createMultipleDnsRecord = async (req: Request, res: Response) => {
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
              TTL: dnsRecords.TTL || default_TTL,
              ResourceRecords: dnsRecords.ResourceRecords.map((value: any) => ({
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
      const command = new ChangeResourceRecordSetsCommand(params);
      const response = await aws_route53_client.send(command);

      res.status(200).json({
        message: "multiple DNS Record created successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error while creating multiple DNS records: ", error);
      res
        .status(500)
        .json({ error: "Error while creating multiple DNS records" });
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const updateDnsRecords = async (req: Request, res: Response) => {
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
        const existingRecords = await isExistingDnsRecords(
          record.Name,
          record.Type,
          HostedZoneId
        );

        console.log({ existingRecords });

        if (existingRecords && existingRecords.length > 0) {
          const ChangeBatch: ChangeResourceRecordSetsCommandInput = {
            HostedZoneId,
            ChangeBatch: {
              Changes: [
                {
                  Action: "UPSERT" as ChangeAction,
                  ResourceRecordSet: {
                    Name: record.Name,
                    Type: record.Type,
                    TTL: record.TTL || default_TTL,
                    ResourceRecords: record.ResourceRecords.map(
                      (value: any) => ({
                        Value: value.Value,
                      })
                    ),
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
          const command = new ChangeResourceRecordSetsCommand(params);
          await aws_route53_client.send(command);

          console.log("Record updated successfully:", record);
        } else {
          console.log("No matching records found to update for:", record);
        }
      }
      res
        .status(200)
        .json({ message: "DNS Record updates attempted successfully." });
    } catch (error) {
      console.error("Error while updating DNS records:", error);
      res.status(500).json({ error: "Error while updating DNS records" });
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const isExistingDnsRecords = async (
  name: string,
  type: string,
  HostedZoneId: string
) => {
  const formattedName = name.endsWith(".") ? name : `${name}.`;

  const command = new ListResourceRecordSetsCommand({
    HostedZoneId,
    MaxItems: 100,
    StartRecordName: formattedName,
    StartRecordType: type as RRType,
  });

  const { ResourceRecordSets } = await aws_route53_client.send(command);

  return ResourceRecordSets?.filter(
    (record) =>
      record?.Name?.toLowerCase() === formattedName.toLowerCase() &&
      record.Type === type
  );
};
