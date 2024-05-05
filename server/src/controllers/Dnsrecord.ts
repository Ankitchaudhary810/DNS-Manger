import { Request, Response, NextFunction } from "express";

export const listDnsRecords = (req: Request, res: Response) => {
  if (req.method === "GET") {
  } else {
    res.status(405).json({ error: `${req.method} Method not allowed` });
  }
};
