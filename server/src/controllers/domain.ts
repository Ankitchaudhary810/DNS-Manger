import {
  CreateHostedZoneCommand,
  DeleteHostedZoneCommand,
  ListHostedZonesCommand,
} from "@aws-sdk/client-route-53";
import { Request, Response, NextFunction, response } from "express";
import aws_route53_client from "../utility";

export const createDomain = async (req: Request, res: Response) => {
  if (req.method == "POST") {
    try {
      const domainNams = req.body;
      console.log(domainNams);
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
          CallerReference: `${Date.now()}`,
          HostedZoneConfig: {
            Comment: " ", // don't know what is thing
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

export const listDomain = async (req: Request, res: Response) => {
  if (req.method == "GET") {
    try {
      const command = new ListHostedZonesCommand({});
      const { HostedZones } = await aws_route53_client.send(command);
      res.status(200).json(HostedZones);
    } catch (error) {
      console.error("Error while listing hosted zones ", error);
      throw error;
    }
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};

export const deleteDomain = async (req: Request, res: Response) => {
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

        const domainExists = domainAlreadyExits?.find(
          (zone) =>
            zone &&
            zone.Name &&
            (zone.Name.toLowerCase() === (Name + ".").toLowerCase() ||
              zone.Name.toLowerCase() === fullyQualifiedName.toLowerCase())
        );
        if (!domainExists) {
          console.log(`Hosted zone '${fullyQualifiedName}' does not exists.`);
          continue;
        }
        const params = {
          Id: domainExists.Id,
        };
        const command = new DeleteHostedZoneCommand(params);
        await aws_route53_client.send(command);
        dataLog.push({ domain: Name, status: "Deleted" });
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
