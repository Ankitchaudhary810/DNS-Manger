"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HomeImage from "../public/home.jpg";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="px-4 md:px-8 lg:px-12 xl:px-16 flex flex-col lg:flex-row justify-between gap-8">
        {/* for image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <Image src={HomeImage} alt="home-image" width={600} height={600} />
        </div>

        <div className="w-full lg:w-1/2 sm:mt-28 mt-1">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6 text-nowrap">
            Be Productive to Your{" "}
            <span className="bg-[#7D96F0] rounded-xl px-2 py-1 text-xl justify-start items-center">
              DNS
            </span>
          </h1>
          <p className="text-base lg:text-lg mb-4 lg:mb-6  text-[#7D96F0]">
            DNS (Domain Name System) translates human-readable domain names into
            IP addresses, enabling browsers to load internet resources
            efficiently and reliably.
          </p>
          <Button
            className="text-black hover:text-white transition-all hover:bg-[#7D96F0]"
            variant="outline"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Continue.
          </Button>
        </div>
      </div>
    </>
  );
}
