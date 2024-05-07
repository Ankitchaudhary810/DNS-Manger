"use client";
import { Input } from "@/components/ui/input";
import { useListDomain } from "@/hooks/useListDomain";
import React from "react";

const Dashboard = () => {
  const { domain, isLoading } = useListDomain();
  console.log(domain);
  return (
    <div className="grid grid-cols-12 h-full w-full">
      {/* lef side */}
      <div className="grid col-span-3 h-full w-full p-3 ">
        <div className="bg-slate-100 w-full h-full p-3 rounded-xl  border border-3 border-zinc-600">
          <p className="font-medium text-sm">Domain Creation</p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter domain Name"
              className="mt-1 w-full outline-none bg-teal-50 p-2 rounded-lg "
            />
            <button className="bg-[#7D96F0] p-2 mt-1 rounded-lg text-white">
              Create
            </button>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className="grid col-span-9 h-full w-full">
        <div className="bg-slate-100 w-full text-sm h-full p-2 rounded-xl font-medium border border-3 border-zinc-600">
          Upload Section.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
