import React from "react";

type DomainCardProps = {
  Name: string;
  recordLength: number;
};

const DomainCard = ({ Name, recordLength }: DomainCardProps) => {
  return (
    <div className="flex justify-between items-center bg-blue-300 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-400 transition-colors duration-300 ease-in-out">
      <span className="text-sm font-medium">{Name}</span>
      <span className="text-xs bg-white text-blue-500 py-1 px-3 rounded-full ml-2">
        {recordLength} Records
      </span>
    </div>
  );
};

export default DomainCard;
