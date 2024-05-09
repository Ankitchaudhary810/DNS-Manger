"use client";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type DomainCardProps = {
  Name: string;
  recordLength: number;
  hostedId: string;
  onDelete: () => void;
};

const DomainCard = ({
  Name,
  recordLength,
  onDelete,
  hostedId,
}: DomainCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dnsRecordsData, setDnsRecordsData] = useState([]);

  const handleLoadDetails = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchDnsRecordsData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL +
          "/list/all/dns/records" +
          `?HostedZoneId=${hostedId.split("/")[2]}`
      );

      const data = await response.json();
      setDnsRecordsData(data);
      console.log("data: ", data);
    };

    setLoading(false);

    fetchDnsRecordsData();
  }, [isModalOpen]);
  return (
    <div className="flex justify-between items-center bg-blue-300 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-400 transition-colors duration-300 ease-in-out">
      <span className="text-sm font-medium">{Name}</span>
      <span
        className="text-xs bg-white text-blue-500 py-1 px-3 rounded-full ml-2 hover:bg-blue-200 cursor-pointer"
        onClick={handleLoadDetails}
      >
        {recordLength} Records
      </span>
      <span
        className="p-1 hover:bg-slate-500 rounded-md m-1 cursor-pointer"
        onClick={onDelete}
      >
        <FaRegTrashAlt color="red" />
      </span>

      {isModalOpen && (
        <Dialog open={isModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Dns Details.</DialogTitle>
            <DialogDescription>
              Here are the details of your domain.
            </DialogDescription>
            <div>
              <p>Name: {Name}</p>
              <p>Number of Records: {recordLength}</p>
              <p>Hosted ID: {hostedId}</p>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCloseModal}
                className="bg-blue-300 hover:bg-blue-500"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DomainCard;
