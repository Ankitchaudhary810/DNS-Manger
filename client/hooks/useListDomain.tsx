"use client";

import { QueryClient, useQuery } from "@tanstack/react-query";
export const useListDomain = () => {
  const query = useQuery({
    queryKey: ["list-domain"],
    queryFn: async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/domain/list",
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to find the domain");
      }
      return await response.json();
    },
  });
  return { ...query, domain: query.data, isLoading: query.isLoading };
};
