"use client";
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

  const handleInputChange = (event: any) => {
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
    <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full">
      {/* Left side */}
      <div className="col-span-1 sm:col-span-3 h-full w-full p-2">
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
      <div className="col-span-1 md:col-span-9 h-full w-full  p-2">
        <div className="bg-slate-100 w-full text-sm h-full p-2 rounded-xl font-medium border border-3 border-zinc-600">
          <h2 className="text-lg">Domains List</h2>
          <ul>
            {domain?.map((dom: Domain) => (
              <li key={domain}>{dom.Name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
