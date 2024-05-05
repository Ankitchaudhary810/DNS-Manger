import {
  CreateHostedZoneCommand,
  ListHostedZonesCommand,
} from "@aws-sdk/client-route-53";
import { Request, Response, NextFunction, response } from "express";
import aws_route53_client from "../utility";

export const createDomain = async (req: Request, res: Response) => {
  if (req.method == "POST") {
    try {
      const domainNams = req.body;
      const domainAlreadyExits = await isDomainExist();
      const dataLog = [];
      for (const domain in domainNams) {
        // TODO: NEED TO FIX THE TYPE
        // @ts-ignore
        const { Name } = domainNams[domain];
        const fullyQualifiedName = Name.endsWith(".") ? Name : `${Name}.`;

        if (
          domainAlreadyExits?.find(
            (zone) =>
              zone &&
              zone.Name &&
              (zone.Name.toLowerCase() === (Name + ".").toLowerCase() ||
                zone.Name.toLowerCase() === fullyQualifiedName.toLowerCase())
          )
        ) {
          console.log(
            `Hosted zone '${fullyQualifiedName}' already exists. Skipping creation.`
          );
          continue;
        }

        const params = {
          Name: fullyQualifiedName,
          CallerReference: `${Date.now()}`, // need to be in string format
          HostedZoneConfig: {
            Comment: " ",
            PrivateZone: false,
          },
        };

        const command = new CreateHostedZoneCommand(params);
        const { HostedZone } = await aws_route53_client.send(command);
        dataLog.push(HostedZone?.Name);
      }

      if (dataLog.length === 0) {
        console.log("No domain is created");
      }
      res.status(200).json(dataLog);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const isDomainExist = async () => {
  const command = new ListHostedZonesCommand({});
  const { HostedZones } = await aws_route53_client.send(command);
  return HostedZones;
};
