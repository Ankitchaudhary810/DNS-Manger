"use client";
import DomainCard from "@/components/DomainCard";
import SkeletonDomin from "@/components/SkeletonDomin";
import { useAddDomain } from "@/hooks/useAddDomain";
import { useListDomain } from "@/hooks/useListDomain";
import React, { useState } from "react";

export interface Domain {
  Name: string;
}

const Dashboard = () => {
  const { isLoading, domain } = useListDomain();
  const [currentDomain, setCurrentDomain] = useState("");
  const [domains, setDomains] = useState<Domain[]>([]);

  const { mutate } = useAddDomain();
  console.log(domain);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDomain(event.target.value);
  };

  const handleAddDomain = () => {
    if (currentDomain) {
      const newDomain = { Name: currentDomain };
      // @ts-ignore
      mutate(newDomain, {
        onSuccess: () => {
          setDomains((prevDomains) => [...prevDomains, newDomain]);
          setCurrentDomain("");
        },
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 ">
        {/* Left side */}
        <div className="col-span-1 sm:col-span-3 max-h-32 w-full p-2">
          <div className="bg-slate-100 w-full h-full p-3 rounded-xl border border-3 border-zinc-600">
            <p className="font-medium text-sm">Domain Creation</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter domain Name"
                className="mt-1 w-full outline-none bg-teal-50 p-2 rounded-lg"
                value={currentDomain}
                onChange={handleInputChange}
              />
              <button
                className="bg-[#7D96F0] p-2 mt-1 rounded-lg text-white"
                onClick={handleAddDomain}
              >
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="col-span-1 md:col-span-9 h-full w-full p-2">
          <div className="bg-slate-100 w-full text-sm h-full p-2 rounded-xl font-medium border border-3 border-zinc-600 ">
            <h2 className="text-lg">Domains List</h2>
            <div className="flex flex-row gap-3 p-1 flex-wrap">
              {isLoading
                ? Array.from({ length: 7 }, (_, index) => (
                    <SkeletonDomin key={index} />
                  ))
                : domain?.map((dom: any) => (
                    <DomainCard
                      Name={dom.Name}
                      key={dom.id}
                      recordLength={dom.ResourceRecordSetCount}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
