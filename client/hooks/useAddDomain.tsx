"use client";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Domain } from "domain";
import toast from "react-hot-toast";

export const useAddDomain = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["ADD_DOMAIN"],
    mutationFn: async (domain) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/domain/create",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ Name: domain }),
          cache: "no-cache",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to find the add domain");
      }
      return await response.json();
    },

    onMutate: async () => {
      toast.loading("Creating...", { id: "1" });
    },
    onSuccess: async () => {
      toast.success("Done", { id: "1" });
      queryClient.invalidateQueries({ queryKey: ["list-domain"] });
    },
    onError: async () => {
      toast.error("Fail to update", { id: "1" });
    },
  });

  return { ...mutation, data: mutation.data };
};
